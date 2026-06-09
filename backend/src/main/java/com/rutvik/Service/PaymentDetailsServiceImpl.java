package com.rutvik.Service;

import com.rutvik.model.PaymentDetails;
import com.rutvik.model.User;
import com.rutvik.Repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

    @Override
    public PaymentDetails addPaymentDetails(String accountNumber,
                                            String accountHolderName,
                                            String ifsc,
                                            String bankName,
                                            User user) {

        // 1. Check if the user already has payment details
        PaymentDetails paymentDetails = paymentDetailsRepository.findByUserId(user.getId());

        // 2. If details don't exist, create a new object and link the user
        if (paymentDetails == null) {
            paymentDetails = new PaymentDetails();
            paymentDetails.setUser(user);
        }

        // 3. Update the fields (Works for both NEW and EXISTING records)
        paymentDetails.setAccountNumber(accountNumber);
        paymentDetails.setAccountHolderName(accountHolderName);
        paymentDetails.setIfsc(ifsc);
        paymentDetails.setBankName(bankName);

        // 4. Save will now perform an UPDATE if ID exists, or INSERT if it doesn't
        return paymentDetailsRepository.save(paymentDetails);
    }

    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}