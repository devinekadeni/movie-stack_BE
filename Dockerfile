FROM node:14.15.4

# define working directory inside the container
WORKDIR /usr/src/movie-stack_BE

COPY ./ ./

RUN npm install
RUN npm install -g nodemon

EXPOSE 3300

CMD ["/bin/bash"]