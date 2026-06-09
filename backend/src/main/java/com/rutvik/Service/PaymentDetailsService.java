package com.rutvik.Service;

import com.rutvik.model.PaymentDetails;
import com.rutvik.model.User;

public interface PaymentDetailsService {

    PaymentDetails addPaymentDetails(String accountNumber,
                                     String accountHolderName,
                                     String ifsc,
                                     String bankName,
                                     User user);

    PaymentDetails getUsersPaymentDetails(User user);
}
