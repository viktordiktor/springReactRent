package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository mockUserRepository;

    private UserService userServiceUnderTest;

    @BeforeEach
    void setUp() {
        userServiceUnderTest = new UserService(mockUserRepository);
    }

    @Test
    void testFindAll() {
        final List<User> expectedResult = List.of(User.builder()
                .id(0)
                .build());
        when(mockUserRepository.findAll()).thenReturn(List.of(User.builder()
                .id(0)
                .build()));

        final List<User> result = userServiceUnderTest.findAll();

        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindAll_UserRepositoryReturnsNoItems() {
        when(mockUserRepository.findAll()).thenReturn(Collections.emptyList());

        final List<User> result = userServiceUnderTest.findAll();

        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testUpdate() {
        final User updatedUser = User.builder()
                .id(0)
                .build();

        userServiceUnderTest.update(0, updatedUser);

        verify(mockUserRepository).save(User.builder()
                .id(0)
                .build());
    }

    @Test
    void testFindByEmail() {
        final Optional<User> expectedResult = Optional.of(User.builder()
                .id(0)
                .build());

        final Optional<User> user = Optional.of(User.builder()
                .id(0)
                .build());
        when(mockUserRepository.findByEmail("email")).thenReturn(user);

        final Optional<User> result = userServiceUnderTest.findByEmail("email");

        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testFindByEmail_UserRepositoryReturnsAbsent() {
        when(mockUserRepository.findByEmail("email")).thenReturn(Optional.empty());

        final Optional<User> result = userServiceUnderTest.findByEmail("email");

        assertThat(result).isEmpty();
    }
}
