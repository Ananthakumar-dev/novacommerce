package com.novacommerce.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String streetAddress;
    private String apartment;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private boolean isDefault;
    private Date createdAt;
    private Date updatedAt;
}
