Installing SNAPP
-----

1. Grab this code
1. Edit `config.properties` to set the correct value for `sakai.host`. Default is `http://localhost:8080`.
1. Run `mvn clean install sakai:deploy` from the top level directory. You may need to include `-Dsakai.tomcat.home=/path/to/your/tomcat` if you have not configured this in Maven.
1. Start Tomcat
1. Open your browser and enter the URL `http://your.sakai.server/SNAPP/index.html`
1. Right click on SNAPP V2 Beta link and bookmark the link.