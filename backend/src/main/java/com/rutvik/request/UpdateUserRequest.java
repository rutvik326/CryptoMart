package com.rutvik.request;

import lombok.Data;

@Data
public class UpdateUserRequest {

    private String fullName;

    private String dateOfBirth;

    private String nationality;

    private AddressRequest address;

    @Data
    public static class AddressRequest {

        private String street;

        private String city;

        private String postCode;

        private String country;
    }
}
