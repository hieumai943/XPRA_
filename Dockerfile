FROM tswetnam/xpra:bionic

COPY volume_xpra_2/ /usr/share/xpra


RUN rm -f /usr/share/xpra/www/index.html.br 
RUN rm -f /usr/share/xpra/www/css/menu.css.br
RUN rm -f /usr/share/xpra/www/css/menu-skin.css.br

CMD ["xpra", "start", "--bind-tcp=0.0.0.0:9876", "--html=on", "--start-child=xterm", "--exit-with-children=no", "--daemon=no", "--xvfb=/usr/bin/Xvfb +extension Composite -screen 0 1920x1080x24+32 -nolisten tcp -noreset", "--pulseaudio=no", "--notifications=no", "--bell=no", ":100"]
