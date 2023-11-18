package com.nikonenko.propertyBoot.security.auth;


import com.nikonenko.propertyBoot.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  private String fullName;
  private String phone;
  private String email;
  private String password;
  private Role role;
}
