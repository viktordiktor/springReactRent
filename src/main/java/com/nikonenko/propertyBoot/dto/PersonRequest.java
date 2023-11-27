package com.nikonenko.propertyBoot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonRequest {
    @NotBlank(message = "Полное имя не может быть пустым")
    private String fullName;

    @NotBlank(message = "Телефон не может быть пустым")
    @Pattern(regexp = "\\d{10}", message = "Неверный формат телефона")
    private String phone;
}
