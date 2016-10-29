# A ChromeOS-style LightDM Webkit Greeter Theme

Please post feature requests in Issues. I will get back ASAP and add them if they stay true to Chromium OS's design. After all, this is a clone.

### Install on Ubuntu (though this will work on any distro that supports `lightdm-webkit-greeter`)
1. Install **lightdm** and **lightdm-webkit-greeter**.
```
$ sudo apt-get install lightdm lightdm-webkit-greeter
```
2. Navigate to the `themes` folder.
```
$ cd /usr/share/lightdm-webkit/themes/
```
3. Clone this repository there.
```
$ git clone https://github.com/legostax/lightdm-webkit-chromium.git
```
4. Point the greeter to this theme.  Open your favorite text editor
```
$ nano /etc/lightdm/lightdm-webkit-greeter.conf
```
Replace the theme name with `lightdm-webkit-chromium`

### Configuration
You can change the background by replacing the `wallpaper.jpg` with your own photo

**NOTE: IT MUST BE THE SAME FILE NAME**
