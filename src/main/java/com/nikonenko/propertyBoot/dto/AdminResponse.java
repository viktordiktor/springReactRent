package com.nikonenko.propertyBoot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponse {
    @JsonProperty("users")
    private List<User> users;
    @JsonProperty("props")
    private List<Property> properties;
}
