//该文件用来声明当前壁纸是否需要以下这些数据资源，必须在页面加载时执行本脚本文件
//This file is used to declare whether the current wallpaper requires the following data resources. This script must be executed when the page loads.
//Этот файл используется для объявления того, требуются ли текущим обоям следующие ресурсы данных. Этот скрипт должен быть выполнен при загрузке страницы.
//Este arquivo é usado para declarar se o papel de parede atual requer os seguintes recursos de dados. Este script deve ser executado quando a página é carregada.
//Ten plik służy do deklarowania, czy bieżąca tapeta wymaga następujących zasobów danych. Ten skrypt musi zostać wykonany podczas ładowania strony.
//이 파일은 현재 배경화면이 다음 데이터 리소스가 필요한지 여부를 선언하는 데 사용됩니다. 이 스크립트는 페이지 로드 시 실행되어야 합니다.
//このファイルは、現在の壁紙が以下のデータリソースを必要とするかどうかを宣言するために使用されます。このスクリプトはページ読み込み時に実行する必要があります。
//Este archivo se utiliza para declarar si el fondo de pantalla actual requiere los siguientes recursos de datos. Este script debe ejecutarse cuando se carga la página.
//Ce fichier est utilisé pour déclarer si le fond d'écran actuel nécessite les ressources de données suivantes. Ce script doit être exécuté lors du chargement de la page.
//Diese Datei wird verwendet, um festzulegen, ob das aktuelle Hintergrundbild die folgenden Datenressourcen benötigt. Dieses Skript muss beim Laden der Seite ausgeführt werden.


//声明壁纸是否需要实时读取鼠标操作，包括位置、按键、滚轮等，传入true或false表示是否需要
//Declares whether the wallpaper needs real-time mouse input (position, buttons, scroll wheel, etc.). Pass true or false to indicate if required.
//Определяет, требуется ли обоям доступ к данным мыши в реальном времени (положение, кнопки, колесо прокрутки и т.д.). Передайте true или false для указания необходимости.
//Declara se o papel de parede precisa ler operações do mouse em tempo real (posição, botões, roda de scroll etc.). Passe true ou false para indicar se é necessário.
//Określa, czy tapeta wymaga dostępu do operacji myszy w czasie rzeczywistym (pozycja, przyciski, kółko itp.). Przekaż true lub false aby wskazać potrzebę.
//배경화면이 실시간 마우스 동작(위치, 버튼, 휠 등)을 읽어야 하는지 선언합니다. 필요 여부를 true 또는 false로 전달하십시오.
//壁紙がマウス操作(位置、ボタン、ホイールなど)をリアルタイムで読み取る必要があるかどうかを宣言します。必要な場合はtrue、不要な場合はfalseを渡してください。
//Declara si el fondo de pantalla necesita leer las operaciones del ratón en tiempo real (posición, botones, rueda, etc.). Pase true o false para indicar si es necesario.
//Déclare si le fond d'écran nécessite la lecture en temps réel des actions de la souris (position, boutons, molette, etc.). Passez true ou false pour indiquer si c'est nécessaire.
//Legt fest, ob die Hintergrundgrafik Mausaktionen in Echtzeit (Position, Tasten, Scrollrad etc.) lesen muss. Übergeben Sie true oder false, um dies anzugeben.
ForepaperEngineDeclareResourceRequirements('NeedReadMouse', true);

//声明壁纸是否需要实时读取键盘操作，传入true或false表示是否需要
//Declares whether the wallpaper needs real-time keyboard input. Pass true or false to indicate if required.
//Определяет, требуется ли обоям доступ к данным клавиатуры в реальном времени. Передайте true или false для указания необходимости.
//Declara se o papel de parede precisa ler operações do teclado em tempo real. Passe true ou false para indicar se é necessário.
//Określa, czy tapeta wymaga dostępu do operacji klawiatury w czasie rzeczywistym. Przekaż true lub false aby wskazać potrzebę.
//배경화면이 실시간 키보드 동작을 읽어야 하는지 선언합니다. 필요 여부를 true 또는 false로 전달하십시오.
//壁紙がキーボード操作をリアルタイムで読み取る必要があるかどうかを宣言します。必要な場合はtrue、不要な場合はfalseを渡してください。
//Declara si el fondo de pantalla necesita leer las pulsaciones del teclado en tiempo real. Pase true o false para indicar si es necesario.
//Déclare si le fond d'écran nécessite la lecture en temps réel des saisies au clavier. Passez true ou false pour indiquer si c'est nécessaire.
//Legt fest, ob die Hintergrundgrafik Tastatureingaben in Echtzeit lesen muss. Übergeben Sie true oder false, um dies anzugeben.
ForepaperEngineDeclareResourceRequirements('NeedReadKeyboard', false);

//声明壁纸是否需要联网，传入true或false表示是否需要
//Declares whether the wallpaper requires internet access. Pass true or false to indicate if needed.
//Определяет, требуется ли обоям доступ к интернету. Передайте true или false для указания необходимости.
//Declara se o papel de parede requer acesso à internet. Passe true ou false para indicar se é necessário.
//Określa, czy tapeta wymaga dostępu do internetu. Przekaż true lub false aby wskazać potrzebę.
//배경화면이 인터넷 접속이 필요한지 선언합니다. 필요 여부를 true 또는 false로 전달하십시오.
//壁紙がインターネット接続を必要とするかどうかを宣言します。必要な場合はtrue、不要な場合はfalseを指定してください。
//Declara si el fondo de pantalla requiere acceso a internet. Indique true o false según sea necesario.
//Déclare si le fond d'écran nécessite un accès à internet. Passez true ou false pour indiquer si c'est requis.
//Legt fest, ob die Hintergrundgrafik Internetzugriff benötigt. Geben Sie true oder false an, um dies zu definieren.
ForepaperEngineDeclareResourceRequirements('NeedNetwork', false);

//声明壁纸是否需要访问本地文件，传入true或false表示是否需要
//Declares whether the wallpaper requires access to local files. Pass true or false to indicate if needed.
//Определяет, требуется ли обоям доступ к локальным файлам. Передайте true или false для указания необходимости.
//Declara se o papel de parede requer acesso a arquivos locais. Passe true ou false para indicar se é necessário.
//Określa, czy tapeta wymaga dostępu do plików lokalnych. Przekaż true lub false aby wskazać potrzebę.
//배경화면이 로컬 파일 접근이 필요한지 선언합니다. 필요 여부를 true 또는 false로 전달하십시오.
//壁紙がローカルファイルへのアクセスを必要とするかどうかを宣言します。必要な場合はtrue、不要な場合はfalseを指定してください。
//Declara si el fondo de pantalla requiere acceso a archivos locales. Indique true o false según sea necesario.
//Déclare si le fond d'écran nécessite un accès aux fichiers locaux. Passez true ou false pour indiquer si c'est requis.
//Legt fest, ob die Hintergrundgrafik Zugriff auf lokale Dateien benötigt. Geben Sie true oder false an, um dies zu definieren.
ForepaperEngineDeclareResourceRequirements('NeedAccessFile', true);