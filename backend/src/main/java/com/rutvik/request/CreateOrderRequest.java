package com.rutvik.request;

import lombok.Data;

@Data
public class CreateOrderRequest {

    private String coinId;
    private double quantity;
}
