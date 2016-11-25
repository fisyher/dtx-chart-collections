#Tasklist for 0.0.1
---

Update: 25/11/2016

1. Sample JSON Data of DTX documents created (16)
2. 5 views: Song List View, Song Detail View, DTX Info View, Login View, Logout View

TODO:  
1. Simple High Level Documentation of Functions, View UI and Data presentation  (View UI :heavy_check_mark:)  
2. Design high-level API functional specs  
3. Design JSON schema of the required data for each view (1st round done)

Target: 28/11/2016

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
