# REST API for Interacting with Audio Elements

## Goal
The Goal of this assignment is to exposte a simple API service that lets users add/edit/get/delete audio elements to videos created on a video editing platform.


## Description

Consider a video editing service named "VideoMaker" that stores their videos created on their platform as JSON. An example video in JSON format can be found here. Any video has two set of elements `video_blocks` and `audio_blocks`. This assignment is primarily working on the `audio_blocks`

You need to expose a REST API that allows users to perform CRUD operations for the audio elements in the video. <b>VideoMaker</b> app supports three types of audio
elements

+ Voice Over  (represented as <b> vo </b>)
+ Background Music (represented as <b> bg_music </b>)
+ Video Music (represented as <b> video_music </b>): This element is a placeholder to represent audio within a video. For this element, it stores the reference to an existing video block and doesn't replicate duration/url information

### Audio Element Fields

Each audio element has following fields


	{
		"id": "<unique identifier generated server side>",
		"type": <vo|bg_music|video_music>",
		"high_volume": <volume when this element is not overlapping with other audio element>,
		"low_volume": <volume when this element is overlapping with other audio element>,
		"video_component_id": <video component id if type is video_music else null>,
		"url": <url for the audio file. null if type is video_music>
		"duration": {
			# this is null if type is video_music
			start_time: <start time for audio>
			end_time: <end_time for audio>
		}
	}


### Audio Element Volume

As seen above, an audio element have two different type of volumes defined. `High Volume` and `Low volume`. This is because, audio elements of different types can overlap. A particular audio element plays at `High Volume` when its not overlapping with other audio elements, otherwise each of the overlapping elements plays at `Low Volume`


## API

### Add Audio Element

+ Add an audio element to the video. This api is also called to add audio layer for the video in which case it receives the video_component_id.

+ It is possible for different type of audio elements to overlap, but two audio elements of same type cannot overlap. For eg if there is an existing `vo` element from 5 - 20 seconds, and we receive a new `vo` element to be added from 15 - 25 seconds, it should actually be added from 20 - 30 seconds

### Get Audio Element By ID

+ Return an audio element by ID.

+ For `video_audio`, it should populate the duration and url from the corresponding video block

### Delete Audio Element by ID

+ Delete an audio element by ID.

+ In case of video_audio, we shouldn't delete the original video component

### Update Audio Element By ID

+ Update an audio element by ID

+ In case of video_audio, we shouldn't update the original video component


### Get Audio Fragments between start and end time

+ This API must return all audio fragments that exists between the provided start and end time.

+ Unlike, audio element, an audio fragment has only one volume - aka volume at which that particular fragment must be played. What i mean by this is that an audio element is divided into multiple audio fragments depending upon whether its overlapping with other elements or not. Lets take an example of a video with three audio elements

	
	+ vo with start time as 5 and end time as 20
	
	+ bg_music with start time as 10 and end time as 40

	+ video_music with start time as 15 and end time as 25
	
We will get following audio fragments for this video between 0 - 30 seconds

	+ vo with start time as 5, end time as 10, volume as High Volume

	+ vo with start time as 10, end time as 20 volume as Low Volume

	+ bg_music with start time as 10, end time as 25, volume as Low Volume

	+ bg_music with start time as 25, end time as 30, volume as High Volume

	+ video_music with start time as 15, end time as 25, volume as Low


Example response for the example video json


	[
    {
        id: "123",
        url: "",
        volume: 100,  # High volume no overlap
        type: "vo",
        duration: {
            start_time: 5,
            end_time: 10
        }

    },
    {
        id: "123",
        url: "",
        type: "vo",  # Low volume since overlap
        volume: 75g
        duration: {
            start_time: 10,
            end_time: 20
        }

    },
    {
        id: "456",
        url: "",
        type: "bg_music", # Low volume since overlap
        volume: 25
        duration: {
            start_time: 10,
            end_time: 25
        }
    },
    {
        id: "456",
        url: "",
        type: "bg_music", # High volume since overlap
        volume: 100
        duration: {
            start_time: 25,
            end_time: 30
        }
    },
    {
        id: "abc",
        url: "",
        type: "video_audio", # Low volume since overlap
        volume: 50
        duration: {
            start_time: 15,
            end_time: 25
        }
    }
    ]



## Deliverables

- A simple server with following set of API's as mentioned above

- Source code commited on github(preferable) / bitbucket/ gitlab

- Readme file to let us know how to run the app and any other documentation that you might want to share

- Deployed on heroku so that we can test the API

## Instructions

- We have included an example video json, along with its video fragments for your reference

- The most important part of this assignment is how you design your abstractions and REST API.

- The code should handle edge cases and do proper error handling

- Please ask questions. Its ok to have doubts and we are eager to answer those.

- Most importantly, have fun building it :) :)
