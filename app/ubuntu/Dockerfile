# Dockerfile modified to bionic from https://github.com/lanrat/docker-xpra-html5

FROM ubuntu:focal



# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="CyVerse XPRA Ubuntu" \
    org.label-schema.description="XPRA Remote Desktop, additional depends for CyVerse K8s workbench" \
    org.label-schema.url="https://cyverse.org" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="e.g. https://github.com/cyverse-vice/xpra" \
    org.label-schema.vendor="CyVerse" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0.0"

# install XPRA: https://xpra.org/trac/wiki/Usage/Docker 
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y wget gnupg2 apt-transport-https && \
    wget -O - https://xpra.org/gpg.asc | apt-key add - && \
    echo "deb https://xpra.org/ focal main" > /etc/apt/sources.list.d/xpra.list

RUN apt-get update && \
    apt-get install -y xpra \
    xvfb \
    xterm \
    sshfs && \
    apt-get clean && \ 
    rm -rf /var/lib/apt/lists/*

RUN apt-key list
    
# Add sudo to user
RUN adduser --disabled-password --gecos "VICE_User" --uid 1000 user
RUN apt-get update && apt-get install -y sudo
RUN usermod -aG sudo user
RUN echo 'ALL ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# install all X apps here
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive && \
    apt-get clean && \ 
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y apt-utils \
    build-essential \
    firefox \
    glances \
    glmark2 \
    gnome-shell \
    gnome-session \
    gnome-terminal \
    htop \
    libqt5x11extras5 \
    linux-generic-hwe-18.04-edge \
    seahorse-nautilus \
    software-properties-common \
    tasksel \
    libreoffice \
    mousepad \
    thunar

RUN mkdir -p /run/user/1000/xpra
RUN mkdir -p /run/xpra
RUN chown user:user /run/user/1000/xpra
RUN chown user:user /run/xpra
RUN echo "LANG=en_US.UTF-8" >> /etc/locale.conf

# Install CyberDuck CLI
RUN echo "deb https://s3.amazonaws.com/repo.deb.cyberduck.io stable main" | tee /etc/apt/sources.list.d/cyberduck.list > /dev/null && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FE7097963FEFBE72 && \
    apt-get update && \
    apt-get install duck

# Install Go
RUN wget -c https://go.dev/dl/go1.21.4.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local


# iRODS iCommands kludge
RUN wget -qO - https://packages.irods.org/irods-signing-key.asc | apt-key add - && \
    echo "deb [arch=amd64] https://packages.irods.org/apt/ focal main" > /etc/apt/sources.list.d/renci-irods.list && \
    apt-get update && \
    apt-get install -y irods-icommands
    
RUN apt install -y irods-icommands


RUN apt-get install -y language-pack-en-base && \ 
    locale-gen en_US.UTF-8 && \ 
    update-locale LANG=en_US.UTF-8

RUN echo LANG="en_US.UTF-8" > /etc/default/locale
RUN echo en_US.UTF-8 UTF-8 >> /etc/locale.gen && locale-gen

# Install MiniConda and Tini
ENV TZ America/Phoenix
ENV LANG=C.UTF-8 
ENV LC_ALL "en_US.UTF-8"
ENV PATH /opt/conda/bin:$PATH

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apt-get update --fix-missing && apt-get install -y wget bzip2 ca-certificates \
    libglib2.0-0 libxext6 libsm6 libxrender1 \
    git mercurial subversion

RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc

    ENV TINI_VERSION v0.19.0
    RUN apt-get update && apt-get install -y curl && \
        curl -L "https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini_${TINI_VERSION#v}-amd64.deb" > tini.deb && \
        dpkg -i tini.deb && \
        rm tini.deb && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*

RUN chown -R user:user /opt/conda

RUN apt-get update && apt-get install -y sudo
RUN usermod -aG sudo user
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

RUN apt-get install -y libqt5x11extras5 
USER user

RUN echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc

# set path for Go
ENV PATH=$PATH:/opt/VirtualGL/bin/:/usr/local/go/bin 

ENV DISPLAY=:100

WORKDIR /home/user

# add iRODS iCommands to user profile as JSON
RUN mkdir /home/user/.irods && echo '{"irods_host": "data.cyverse.org", "irods_port": 1247, "irods_user_name": "$IPLANT_USER", "irods_zone_name": "iplant"}' | tee  > /home/user/.irods/irods_environment.json
COPY xpra_volume/ /usr/share/xpra
USER root

RUN rm -f /usr/share/xpra/www/index.html.br 
RUN rm -f /usr/share/xpra/www/css/menu.css.br
RUN rm -f /usr/share/xpra/www/css/menu-skin.css.br
RUN rm -f /usr/share/xpra/www/js/Window.js.br

USER user

EXPOSE 9876

CMD xpra start --bind-tcp=0.0.0.0:9876 --html=on --start-child=gnome-terminal --exit-with-children=no --daemon=no --xvfb="/usr/bin/Xvfb +extension Composite -screen 0 1920x1080x24+32 -nolisten tcp -noreset" --pulseaudio=no --notifications=no --bell=no :100