package com.rutvik.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Address {

    private String street;

    private String city;

    private String postCode;

    private String country;
}
