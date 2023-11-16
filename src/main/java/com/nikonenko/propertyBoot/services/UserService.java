package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.repositories.UserRepository;
import com.nikonenko.propertyBoot.security.UserSecurityDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty())
            throw new UsernameNotFoundException("User not found!");
        return new UserSecurityDetails(user.get());
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public Optional<User> findOne(int id){
        return userRepository.findById(id);
    }

    @Transactional
    public void save(User user){
        userRepository.save(user);
    }

    @Transactional
    public void update(Long id, User updatedUser, Person person){
        updatedUser.setId(id);
        updatedUser.setPassword(new BCryptPasswordEncoder().encode(updatedUser.getPassword()));
        updatedUser.setPerson(person);
        userRepository.save(updatedUser);
    }

}
