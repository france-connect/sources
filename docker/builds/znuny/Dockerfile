FROM arsartori/znuny:6.0.48

RUN apt-get update \
   && apt-get install -y libdbd-pg-perl postgresql-client \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
