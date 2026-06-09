package com.rutvik.Service;

import com.rutvik.domain.OrderStatus;
import com.rutvik.domain.OrderType;
import com.rutvik.model.*;
import com.rutvik.Repository.OrderItemRepository;
import com.rutvik.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WalletService walletService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AssetService assetService;

    @Override
    public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {

        double price = orderItem.getCoin().getCurrentPrice() * orderItem.getQuantity();

        Order order = new Order();
        order.setUser(user);
        order.setOrderItem(orderItem);
        order.setOrderType(orderType);
        order.setPrice(BigDecimal.valueOf(price));
        order.setTimestamp(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));
    }

    @Override
    public List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
        if (orderType.equals(OrderType.BUY)) {
            return buyAsset(coin, quantity, user);
        } else if (orderType.equals(OrderType.SELL)) {
            return sellAsset(coin, quantity, user);
        }
        throw new Exception("Invalid order type");
    }

    private OrderItem createOrderItem(Coin coin, double quantity, double buyPrice, double sellPrice) {
        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(sellPrice);
        return orderItemRepository.save(orderItem);
    }

    @Transactional
    public Order buyAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be greater than 0");
        }

        double buyPrice = coin.getCurrentPrice();

        // For BUY orders, sellPrice is 0
        OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, 0);

        Order order = createOrder(user, orderItem, OrderType.BUY);
        orderItem.setOrder(order);

        // Deduct money from wallet
        // Use doubleValue or correct type matching your WalletService
        walletService.payOrderPayment(walletService.getUserWallet(user), order.getPrice().longValue());

        order.setStatus(OrderStatus.SUCCESS);
        order.setOrderType(OrderType.BUY);
        Order savedOrder = orderRepository.save(order);

        // Update Assets
        Asset oldAsset = assetService.findAssetByUserIdAndCoinId(
                order.getUser().getId(),
                order.getOrderItem().getCoin().getId()
        );

        if (oldAsset == null) {
            assetService.createAsset(user, coin, quantity);
        } else {
            assetService.updateAsset(oldAsset.getId(), quantity);
        }

        return savedOrder;
    }

    @Transactional
    public Order sellAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be greater than 0");
        }

        double sellPrice = coin.getCurrentPrice();

        // 1. Find the Asset to get the ORIGINAL Buy Price
        Asset assetToSell = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());

        if (assetToSell == null) {
            throw new Exception("Asset not found, cannot sell");
        }

        if (assetToSell.getQuantity() < quantity) {
            throw new Exception("Insufficient coin balance");
        }

        // 2. KEY FIX: Use the Asset's stored buy price, NOT the current market price
        double buyPrice = assetToSell.getBuyPrice();

        // 3. Create Order Item with Correct Historical Buy Price and Current Sell Price
        OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, sellPrice);

        Order order = createOrder(user, orderItem, OrderType.SELL);
        orderItem.setOrder(order);

        // 4. Add money to wallet
        Wallet wallet = walletService.getUserWallet(user);
        walletService.addBalance(wallet, order.getPrice().longValue());

        order.setStatus(OrderStatus.SUCCESS);
        order.setOrderType(OrderType.SELL);
        Order savedOrder = orderRepository.save(order);

        // 5. Update Asset Quantity
        double newQuantity = assetToSell.getQuantity() - quantity;

        if (newQuantity <= 0) {
            // If sold everything, delete asset (or set to 0)
            assetService.deleteAsset(assetToSell.getId());
        } else {
            // Pass negative quantity to reduce it
            assetService.updateAsset(assetToSell.getId(), -quantity);
        }

        return savedOrder;
    }
}