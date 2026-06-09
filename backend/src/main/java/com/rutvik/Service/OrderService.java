package com.rutvik.Service;

import com.rutvik.domain.OrderType;
import com.rutvik.model.Coin;
import com.rutvik.model.Order;
import com.rutvik.model.OrderItem;
import com.rutvik.model.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}
