# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  
  config.vm.box = "ubuntu/jammy64"
  config.vm.provider "virtualbox"

  # 포트 포워딩 (호스트 3306 → 게스트 3306)
  config.vm.network "forwarded_port", guest: 3306, host: 13306

  # MySQL 자동 설치
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
  SHELL
end
