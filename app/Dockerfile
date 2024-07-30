# Dockerfile for XFCE with XPRA

FROM ubuntu:20.04

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="CyVerse XPRA XFCE" \
    org.label-schema.description="XPRA Remote Desktop with XFCE, additional depends for CyVerse K8s workbench" \
    org.label-schema.url="https://cyverse.org" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="e.g. https://github.com/cyverse-vice/xpra" \
    org.label-schema.vendor="CyVerse" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0.0"

ENV DEBIAN_FRONTEND=noninteractive

# Install XFCE, XPRA, and other necessary packages
RUN apt-get update && apt-get install -y \
    xfce4 \
    xfce4-terminal \
    xorg \
    dbus-x11 \
    x11-xserver-utils \
    sudo \
    wget \
    gnupg2 \
    apt-transport-https \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install XPRA
RUN wget -O - https://xpra.org/gpg.asc | apt-key add - && \
    echo "deb https://xpra.org/ focal main" > /etc/apt/sources.list.d/xpra.list && \
    apt-get update && \
    apt-get install -y xpra xvfb xterm sshfs && \
    apt-get clean && \ 
    rm -rf /var/lib/apt/lists/*

# Add user
RUN adduser --disabled-password --gecos "VICE_User" --uid 1000 user
RUN usermod -aG sudo user
RUN echo 'ALL ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install additional applications
RUN apt-get update && apt-get install -y \
    firefox \
    glances \
    htop \
    libqt5x11extras5 \
    software-properties-common \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Go (adjust version as needed)
RUN wget -c https://go.dev/dl/go1.21.4.linux-amd64.tar.gz -O - | tar -xz -C /usr/local

# Install iRODS iCommands
RUN wget -qO - https://packages.irods.org/irods-signing-key.asc | apt-key add - && \
    echo "deb [arch=amd64] https://packages.irods.org/apt/ focal main" > /etc/apt/sources.list.d/renci-irods.list && \
    apt-get update && \
    apt-get install -y irods-icommands

# Set up locale
RUN apt-get update && apt-get install -y language-pack-en-base && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8

# Install MiniConda
ENV PATH /opt/conda/bin:$PATH
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc

# Install Tini
ENV TINI_VERSION v0.19.0
RUN wget -O /tini https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini && \
    chmod +x /tini

RUN chown -R user:user /opt/conda

USER user
WORKDIR /home/user

# Set up iRODS environment
RUN mkdir /home/user/.irods && echo '{"irods_host": "data.cyverse.org", "irods_port": 1247, "irods_user_name": "$IPLANT_USER", "irods_zone_name": "iplant"}' | tee > /home/user/.irods/irods_environment.json

ENV DISPLAY=:100

EXPOSE 9876

ENTRYPOINT ["/tini", "--"]
CMD ["xpra", "start", "--bind-tcp=0.0.0.0:9876", "--html=on", "--start-child=xfce4-session", "--exit-with-children=no", "--daemon=no", "--xvfb=/usr/bin/Xvfb +extension Composite -screen 0 1920x1080x24+32 -nolisten tcp -noreset", "--pulseaudio=no", "--notifications=no", "--bell=no", ":100"]