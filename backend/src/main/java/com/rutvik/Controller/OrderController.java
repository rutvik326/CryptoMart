    package com.rutvik.Controller;

    import com.rutvik.Service.WalletService;
    import com.rutvik.domain.OrderType;
    import com.rutvik.model.Coin;
    import com.rutvik.model.Order;
    import com.rutvik.model.User;
    import com.rutvik.request.CreateOrderRequest;
    import com.rutvik.Service.CoinService;
    import com.rutvik.Service.OrderService;
    import com.rutvik.Service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/orders")
    public class OrderController {

        @Autowired
        private OrderService orderService;

        @Autowired
        private UserService userService;

        @Autowired
        private CoinService coinService;

        @Autowired
        private WalletService walletService;

        @PostMapping("/pay/{orderType}")
        public ResponseEntity<Order> payOrderPayment(@RequestHeader("Authorization") String jwt,
                                                     @PathVariable OrderType orderType,
                                                     @RequestBody CreateOrderRequest req) throws Exception {

            User user = userService.findUserProfileByJwt(jwt);
            Coin coin = coinService.findById(req.getCoinId());

            Order order = orderService.processOrder(coin, req.getQuantity(), orderType, user);

            return ResponseEntity.ok(order);
        }

        @GetMapping("/{orderId}")
        public ResponseEntity<Order> getOrderById(@RequestHeader("Authorization") String jwt,
                                                  @PathVariable Long orderId) throws Exception {

            User user = userService.findUserProfileByJwt(jwt);

            Order order = orderService.getOrderById(orderId);

            if (order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.ok(order);
            } else {
                throw new Exception("You don't have access to this order");
            }
        }

        @GetMapping
        public ResponseEntity<List<Order>> getAllOrdersForUser(@RequestHeader("Authorization") String jwt,
                                                               @RequestParam(required = false) OrderType orderType,
                                                               @RequestParam(required = false) String assetSymbol) throws Exception {

            Long userId = userService.findUserProfileByJwt(jwt).getId();

            List<Order> userOrders = orderService.getAllOrdersOfUser(userId, orderType, assetSymbol);

            return ResponseEntity.ok(userOrders);
        }
    }
