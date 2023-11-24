package com.nikonenko.propertyBoot.models;

import com.nikonenko.propertyBoot.security.user.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.nikonenko.propertyBoot.security.user.Permission.ADMIN_CREATE;
import static com.nikonenko.propertyBoot.security.user.Permission.ADMIN_DELETE;
import static com.nikonenko.propertyBoot.security.user.Permission.ADMIN_READ;
import static com.nikonenko.propertyBoot.security.user.Permission.ADMIN_UPDATE;


@RequiredArgsConstructor
public enum Role {

  USER(Collections.emptySet()),
  ADMIN(Collections.emptySet()),
  ;

  @Getter
  private final Set<Permission> permissions;

  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
            .stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
            .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    return authorities;
  }
}
