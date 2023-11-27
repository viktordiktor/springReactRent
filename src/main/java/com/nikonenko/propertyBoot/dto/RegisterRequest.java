package com.nikonenko.propertyBoot.dto;


import com.nikonenko.propertyBoot.models.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  @NotBlank(message = "Полное имя не может быть пустым")
  private String fullName;

  @NotBlank(message = "Телефон не может быть пустым")
  @Pattern(regexp = "\\d{10}", message = "Неверный формат телефона")
  private String phone;

  @NotBlank(message = "Email не может быть пустым")
  @Email(message = "Неверный формат email")
  private String email;

  @NotBlank(message = "Пароль не может быть пустым")
  @Size(min = 3, message = "Пароль должен содержать не менее {min} символов")
  private String password;

  private Role role;
}
