# Quests and Achievements Statistics Website
Questing and Achievement Hunting Statistics Website for [Hypixel Minecraft Server](https://hypixel.net)

## Website
The live website can be viewed at [Notifly.zone](https://notifly.zone).

Alternate between Quests and Achievements by clicking the underlined
text on the home page, then enter your username and click `Submit` to generate your statistics

## API Key
This website accesses the [Hypixel API](https://api.hypixel.net), you must use your own private 
api key which you can generate by joining the minecraft server with IP: `mc.hypixel.net` and typing `/api new`.
I store my API key in `credentials.php` which is accessed from other php files when needed.

[Hypixel API GitHub Repository](https://github.com/HypixelDev/PublicAPI)

## Features
As mentioned above, this website supports both Questing and Achievement statistics

Both pages have:
- Formatted username
- Quests completed
- Network level
- Achievement points
- Previous usernames

### Questing
- Daily and Weekly Quest progress
- Leaderboards
  - Overall + per gamemode
  - Monthly
  - Monthly record
  - Yearly
- Level progress
- Charts
- Calendar

### Achievements
- Achievements per gamemode
- Filters
  - points/achievements
  - progress
  - type
- Leaderboards
  - Per gamemode
  - Max gamemode
- Completion progress

## Database
Each leaderboard has a corroponding table in the database which can be queried to fetch the top X entries. The leaderboards are updated each time a player's page is loaded therefore new leaderboards can take time to populate. I used MySQL for my DBMS and SQL to query it. I store the database credentials (host, username, password) in `credentials.php`.

## Forge Mod
There is a companion Forge Mod which runs on Minecraft `1.8.9` and provides basic but accessible features for keeping track of Quests being completed. You can find out more about the mod on the website at [notifly.zone/mod](https://notifly.zone/mod) or view the [Github Repository](https://github.com/db1218/Hypixel-Questing-Mod)

## Libraries/Frameworks
- [Bootstrap](https://getbootstrap.com/) to make the website look how it looks and tooltips
- [jQuery](https://jquery.com/) to manipulate the api data and display it (basically the whole website)
- [Font Awesome](https://fontawesome.com/) for the icons dotted around the site
- [Moment.js](https://momentjs.com/) for the timezones and anything time related on the site
- [Highcharts](https://www.highcharts.com/) for the chart representation of the statistics
- [FullCalendar](https://fullcalendar.io/) for the calendar showing when quests have been completed

## Contact
You can follow my [Twitter](https://twitter.com/Notifly_) for updates on the website or to talk to me about any suggestions for the website

## Images / Gifs
Using the website
![Questing Example](https://i.imgur.com/bEZpv1e.gif)

Dark mode
![Dark mode](https://i.imgur.com/rKbCH0g.png)

Leaderboards
![Leaderboards](https://i.imgur.com/eGTBNSI.png)

Calendar
![Calendar](https://i.imgur.com/AzcqYyY.png)

Achievements
![Achievements](https://i.imgur.com/dnnyqZL.png)
