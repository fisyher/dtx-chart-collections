#Update for 0.0.1
---
Update: 25/12/2016 (Merry Christmas)

REST API functions for CRUD of songs and dtx implemented:

Method | URL	| Action |	Query Parameters |	Request Body |	Outcome |	Response Body |
-------|------|--------|-------------------|---------------|----------|---------------|
GET |	/api/songs |	Get multiple songs	| count:int, offset:int |	none	| Success	 | _count_ number of songs documents minus its embedded dtxdata (dtxList) offset by first _offset_ number of songs, an object to indicate if there are more songs down the list or if count is above the cap limit of 1000
POST |	/api/songs |	Create a new song with at least one dtx in its list |	none |	A song object with one dtxList object containing at least one chart object |	Created |	Message: OK
GET |	/api/songs/count |	Get total count of songs	| none	| none	| Success	| count: _number_
GET	| /api/songs/:songID	| Get a specific song with its entire dtxList	| none	| none	| Success	| Metadata of song and the dtxList minus the raw BarGroup data for each dtx
PUT	| /api/songs/:songID	| Update a specific song metadata only (outside dtxList)	| none	| A song object with updated properties, including dtxList. Missing properties means they will not be updated	| Success	| Message: OK
DELETE	| /api/songs/:songID	| Delete a specific song	| none	| none	| Accepted	| Message: OK			
GET	| /api/songs/:songID<br/>/dtxList/:chartType	| Get dtxdata of specific chart	| none	| none	| Success	| The chart document of _chartType_ in this dtxList
PUT	| /api/songs/:songID<br/>/dtxList | Add or replace a specific chart inside dtxList	| none	| A chart object to replace current chart object or add if it does not exist	| Success	| Message: OK
DELETE	| /api/songs/:songID<br/>/dtxList/:chartType	| Delete a specific chart	| none	| none	| Accepted	| Message: OK


#Tasklist for 0.0.2
---
TODO: 
1. Add User Login and Authentication using passport
2. Create basic 5 views: Song List View, Song Detail View, DTX Info View, Login View, Logout View 

Target: 02/01/2017

##View Layout
---

Start with 3 views:

```
Song List View <---------
|                       |
-> Song Detail view <---| 
|   |                   |
|   |                   |
|------> Dtx Info View--|
```

To add Login, Logout view after.

##Function Description
---

###View UI
---

####Song List View

Song List View shows a table with each row showing:  
1. Title  
2. Artist  
3. Length  
4. BPM  
5. Avaliable Chart (e.g. "Drums, Guitar and Bass" or "Drums only")  

####Song Detail View

Song Detail View shows:  
1. Title  
2. Artist  
3. Length  
4. BPM  
5. Description  
6. Banner image (optional for now)  
7. A table with:  
   * Top-left cell showing Chart Type
   * A header row showing 5 difficulty Levels: Basic, Advanced, Extreme, Master, DTX  
   * Leftmost column show 3 chart types: Drums, Guitar, Bass  
   * Links to each chart's Dtx Info View  

####DTX Info View

DTX Info View shows:  
1. Graph  
2. BPM  
3. Notes (Total note count)   
4. Chart Canvas  
