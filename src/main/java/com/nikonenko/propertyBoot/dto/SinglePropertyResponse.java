package com.nikonenko.propertyBoot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.Property;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SinglePropertyResponse {
    @JsonProperty("person")
    private Person person;
    @JsonProperty("property")
    private Property property;
}
