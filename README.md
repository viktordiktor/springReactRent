# Spring + Hibernate + React + Lombok + JWT App

# Quick Start

    # clone our repo
    # --depth 1 removes all but one .git commit history
    git clone --depth 1 https://github.com/viktordiktor/springReactRent.git
    
    # change directory to our repo
    cd springReactRent
    
    # install the repo with mvn
    mvn install
    
    # start the server
    mvn spring-boot:run

    # start the react frontend
    cd frontend
    npm start
    
    # main page: http://localhost:3000/props
    # there are two built-in user accounts to demonstrate the differing levels of access to the endpoints:
    # - User - email: user@test.ru   password: user
    # - Admin - email: admin@test.ru    password: admin
