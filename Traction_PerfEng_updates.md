## WP2 - Performance Engine

#### 22 February 2021

* Setup requirements list for year 2
* Setup Kanban board on Github repo
* Start working on a few issues:
	- Remote user on single device
	- Edit scene and room number 
* Setup a python interface for the implementation of the stream adaptation


#### 8 March 2021

* Focus group with Liceu and Samp
	- Discussion about the Liceu Showcase plans
	- Detailed setup for Lisbon/Leiria shows in June
	- Define new requirements
* Internal discussion on Perf. Engine organization
  - Separation of Orkestra server from application code
  - Review old code for possible upgrade/refactoring
* Stream Adaptation (DCU)
	- Discussions to finalize the architecture to be included in D2.4.
	- Read about WebRTC to understand how it works, in the case of real-time streaming. 
	- Started designing the adaption algorithm.

#### 22 March 2021

* Stream Adaptation (DCU)
	- Architecture proposal for Non-Real time stream adaptation
	- Identification of which information to use for adaptation
* WebRTC + Janus
  - Look into Janus capabilities and possible alternatives
  - Investigate SFU / Simulcast
  - Minimum latency achievable when using WebRTC, comparison with DASH
  - MCU
* Co-creation Stage
  - Audio improvements: new webRTC publisher component
    * noise suppression, gain control, echo cancellation, voice activity detection
  - Refactoring: Orkestra server separated from Co-creation Stage code
  - Audio only component
  - Setup of new show: specify number of scenes and rooms


#### 07 April 2021

* Work in Progress paper submitted to IMX
* First draft of deliverable sent to Anderson
* Co-Creation stage:
  - Improve bandwidth usage (Mpeg-Dash for pre-recorded videos)
  - Bug fixes
  - Screen recording component: a person in Leiria will be able to see what the operator in Lisbon is doing
  - Add/remove new scenes from main operator interface (previ

