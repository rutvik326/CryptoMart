package com.rutvik.Controller;

import com.rutvik.model.PaymentDetails;
import com.rutvik.model.User;
import com.rutvik.Service.PaymentDetailsService;
import com.rutvik.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment-details") // Base path simplified
public class PaymentDetailsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentDetailsService paymentDetailsService;

    /**
     * POST: Add Payment Details for the first time
     */
    @PostMapping
    public ResponseEntity<PaymentDetails> addPaymentDetails(
            @RequestBody PaymentDetails paymentDetailsRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails = paymentDetailsService.addPaymentDetails(
                paymentDetailsRequest.getAccountNumber(),
                paymentDetailsRequest.getAccountHolderName(),
                paymentDetailsRequest.getIfsc(),
                paymentDetailsRequest.getBankName(),
                user
        );

        return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
    }

    /**
     * PATCH: Update existing Payment Details
     * This fixes the 405 Method Not Allowed error
     */
    @PatchMapping
    public ResponseEntity<PaymentDetails> updatePaymentDetails(
            @RequestBody PaymentDetails paymentDetailsRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        // Fetch existing details first
        PaymentDetails existingDetails = paymentDetailsService.getUsersPaymentDetails(user);

        // If not found, you can either throw an error or redirect to 'add' logic
        if (existingDetails == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Logic to update fields
        PaymentDetails updatedDetails = paymentDetailsService.addPaymentDetails(
                paymentDetailsRequest.getAccountNumber(),
                paymentDetailsRequest.getAccountHolderName(),
                paymentDetailsRequest.getIfsc(),
                paymentDetailsRequest.getBankName(),
                user
        );

        return new ResponseEntity<>(updatedDetails, HttpStatus.OK);
    }

    /**
     * GET: Fetch Payment Details
     */
    @GetMapping
    public ResponseEntity<PaymentDetails> getUsersPaymentDetails(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        PaymentDetails paymentDetails = paymentDetailsService.getUsersPaymentDetails(user);

        return new ResponseEntity<>(paymentDetails, HttpStatus.OK);
    }
}