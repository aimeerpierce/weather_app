## Weather Application

This Weather Application finds the current weather and forecast for a given location. Users can register and see search history as well! It was developed with a MEAN stack: MongoDB, Express, AngularJS, and Node.js. Other tools include [mlab](http://docs.mlab.com/), [Mongoist](https://github.com/saintedlama/mongoist), and [PURE css](https://purecss.io/). 


# Challenges
MongoDB routing: I originally used the Mongoose ODM for MongoDB modeling, but found an even simpler solution with Mongoist.  
Front-End templating: I wanted to try out Jade since it's utilized in the handy [Express Application Generator](https://expressjs.com/en/starter/generator.html). But I had trouble with routing various views and making the page dynamic, so AngularJS was the more practical choice to implement for this project.


# Source Files 

app  
--routes.js  
--cb.js  
public  
--js  
----app.js  
----approutes.js  
----controllers  
------MainCtrl.js  
--css  
----style.css  
--views  
----index.html  
--libs  
server.js  
package.json  
package-lock.json  
bower.json  
README.md  


