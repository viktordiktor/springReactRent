package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> findAll(){
        return userRepository.findAll();
    }

    @Transactional
    public void update(Integer id, User updatedUser){
        updatedUser.setId(id);
        userRepository.save(updatedUser);
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
}
