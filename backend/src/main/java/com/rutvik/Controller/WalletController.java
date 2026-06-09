package com.rutvik.Controller;

import com.rutvik.model.User;
import com.rutvik.model.Wallet;
import com.rutvik.model.WalletTransaction;
import com.rutvik.model.PaymentOrder;
import com.rutvik.domain.PaymentMethod;
import com.rutvik.response.PaymentResponse;
import com.rutvik.Repository.WalletTransactionRepository;
import com.rutvik.Service.UserService;
import com.rutvik.Service.WalletService;
import com.rutvik.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<Wallet> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        return new ResponseEntity<>(wallet, HttpStatus.OK);
    }

    @PutMapping("/deposit")
    public ResponseEntity<PaymentResponse> addMoneyToWallet(
            @RequestHeader("Authorization") String jwt,
            @RequestParam Long amount,
            @RequestParam PaymentMethod paymentMethod) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);

        PaymentResponse res;
        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            res = paymentService.createRazorpayPaymentLink(user, amount);
        } else {
            res = paymentService.createStripePaymentLink(user, amount, order.getId());
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/deposit/success")
    public ResponseEntity<Wallet> paymentSuccess(
            @RequestHeader("Authorization") String jwt,
            @RequestParam Long order_id,
            @RequestParam String payment_id) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(order_id);
        Boolean success = paymentService.proceedPaymentOrder(paymentOrder, payment_id);

        if (success) {
            Wallet wallet = walletService.getUserWallet(user);
            // This now saves the transaction to history
            Wallet updatedWallet = walletService.addBalance(wallet, paymentOrder.getAmount());
            return new ResponseEntity<>(updatedWallet, HttpStatus.OK);
        }
        throw new Exception("Payment verification failed");
    }

    @PutMapping("/{walletId}/transfer")
    public ResponseEntity<Wallet> walletToWalletTransfer(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long walletId,
            @RequestBody WalletTransaction req) throws Exception {

        User senderUser = userService.findUserProfileByJwt(jwt);
        Wallet receiverWallet = walletService.findWalletById(walletId);
        return new ResponseEntity<>(walletService.walletToWalletTransfer(senderUser, receiverWallet, req.getAmount()), HttpStatus.OK);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<WalletTransaction>> getWalletTransactions(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        List<WalletTransaction> transactions = walletTransactionRepository.findByWalletId(wallet.getId());
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }
}