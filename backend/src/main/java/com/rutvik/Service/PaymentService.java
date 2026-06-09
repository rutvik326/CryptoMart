package com.rutvik.Service;

import com.razorpay.RazorpayException;
import com.rutvik.domain.PaymentMethod;
import com.rutvik.model.PaymentOrder;
import com.rutvik.model.User;
import com.rutvik.response.PaymentResponse;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount) throws RazorpayException;

    PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId)throws Exception;
}
