  import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const BLUE = "#D97706";
const BLUE_DARK = "#92400E";
const BLUE_LIGHT = "#FEF3C7";
const SKY = "#FFFBF0";

const TYPES = ["All","Sports","Arts","STEM","Outdoor","Academic","Dance","Music"];
const AGES  = ["All Ages","4-6","7-9","10-12","13-15","16+"];
const COSTS = ["Any Cost","Free","Under $200/wk","$200-$400/wk","$400-$600/wk","$600+/wk"];
const TIMES = ["Any Schedule","Full Day (8h+)","Half Day","Extended Care","Before Care","After Care","Spring Break","Single Day OK"];

const TYPE_STYLE = {
  Sports:  {bg:"#DBEAFE",fg:"#1E40AF",dot:"#3B82F6"},
  Arts:    {bg:"#FCE7F3",fg:"#9D174D",dot:"#EC4899"},
  STEM:    {bg:"#EDE9FE",fg:"#5B21B6",dot:"#8B5CF6"},
  Outdoor: {bg:"#D1FAE5",fg:"#065F46",dot:"#10B981"},
  Academic:{bg:"#E0E7FF",fg:"#3730A3",dot:"#6366F1"},
  Dance:   {bg:"#FFE4E6",fg:"#9F1239",dot:"#F43F5E"},
  Music:   {bg:"#CCFBF1",fg:"#134E4A",dot:"#14B8A6"},
};

const CAMPS = [
  {id:1,name:"Arizona Science Center Camp",org:"Arizona Science Center",type:"STEM",ages:"5-14",cost:"$250/wk",costNum:250,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"600 E Washington St, Phoenix, AZ 85004",lat:33.4484,lng:-112.0669,desc:"Hands-on STEM camps with themed weeks including robotics, chemistry, and space exploration. All skill levels welcome.",schedule:"Mon–Fri, 9am–3pm",web:"https://azscience.org",phone:"(602) 716-2000",extras:"Scholarships available. Members save $50/wk.",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:2,name:"Code Ninjas Summer Camp",org:"Code Ninjas",type:"STEM",ages:"7-14",cost:"$350/wk",costNum:350,dates:"June 9 – Aug 8",startDate:"2025-06-09",endDate:"2025-08-08",address:"3902 E Thomas Rd, Phoenix, AZ 85018",lat:33.4794,lng:-111.9990,desc:"Kids build their own video games using Scratch, JavaScript, and Roblox Studio in a fun ninja-themed environment.",schedule:"Mon–Fri, 9am–3pm",web:"https://codeninjas.com",phone:"(602) 429-0011",extras:"All skill levels. Multiple Valley locations.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:3,name:"iCode Summer Camp",org:"iCode School",type:"STEM",ages:"6-18",cost:"$399/wk",costNum:399,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"8465 E Hartford Dr, Scottsdale, AZ 85255",lat:33.6512,lng:-111.9000,desc:"Coding, drones, game design, AI, 3D printing, and filmmaking camps for every level. Gamified learning that keeps kids engaged.",schedule:"Mon–Fri, 9am–3pm",web:"https://icodeschool.com",phone:"(480) 809-9429",extras:"ESA approved. Scottsdale, Chandler & Peoria locations.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:4,name:"Engineering For Kids Camp",org:"Engineering For Kids Phoenix Metro",type:"STEM",ages:"4-14",cost:"$299/wk",costNum:299,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple Phoenix Metro locations",lat:33.5200,lng:-111.9800,desc:"Kids design, build, test and improve real engineering projects while developing teamwork skills.",schedule:"Mon–Fri, 9am–3pm",web:"https://engineeringforkids.com/phoenix-metro",phone:"(602) 888-0349",extras:"Multiple locations across the Valley.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:5,name:"Mad Science Summer Camp",org:"Mad Science of Arizona",type:"STEM",ages:"5-12",cost:"$275/wk",costNum:275,dates:"June 3 – July 18",startDate:"2025-06-03",endDate:"2025-07-18",address:"Multiple Maricopa County locations",lat:33.4800,lng:-112.0700,desc:"Campers become detectives, engineers and scientists through weekly themed experiments. Owl pellet dissections, bridges, crime scenes and more.",schedule:"Mon–Fri, 9am–12pm or 1pm–4pm",web:"https://madscience.org/arizona",extras:"Different subject every week. Various Valley locations.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:6,name:"Ninja Nation Camp",org:"Ninja Nation",type:"Sports",ages:"5-12",cost:"$299/wk",costNum:299,dates:"May 26 – Aug 1",startDate:"2025-05-26",endDate:"2025-08-01",address:"15449 N Hayden Rd, Scottsdale, AZ 85260",lat:33.6300,lng:-111.9100,desc:"Full-day ninja obstacle course camp with classes, open gym time, team building and competitions. The ultimate day of fun and fitness.",schedule:"Mon–Fri, 8:30am–3:30pm",web:"https://ninjanationcamp.com",extras:"Glendale location also available.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:7,name:"Phoenix Parks Summer Camp",org:"City of Phoenix Parks & Recreation",type:"Outdoor",ages:"6-13",cost:"$60/wk",costNum:60,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"Multiple Phoenix Park locations",lat:33.4651,lng:-112.0794,desc:"Affordable city-run camps with outdoor activities, sports, arts & crafts, and field trips throughout Phoenix neighborhoods.",schedule:"Mon–Fri, 7:30am–5:30pm",web:"https://phoenix.gov/parks",phone:"(602) 262-6861",extras:"Financial assistance available. Most affordable option in Phoenix.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:8,name:"YMCA Summer Day Camp",org:"Valley of the Sun YMCA",type:"Outdoor",ages:"5-15",cost:"$175/wk",costNum:175,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple YMCA locations across the Valley",lat:33.5092,lng:-112.1268,desc:"Classic summer camp with swimming, sports, field trips, and character-building activities. 31 locations across the Valley.",schedule:"Mon–Fri, 7am–6pm",web:"https://valleyofthesunymca.org",phone:"(602) 264-9011",extras:"Swim lessons included. Financial assistance available.",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:9,name:"Camp Zoo",org:"Phoenix Zoo",type:"Outdoor",ages:"5-13",cost:"$350/wk",costNum:350,dates:"June 2 – July 28",startDate:"2025-06-02",endDate:"2025-07-28",address:"455 N Galvin Pkwy, Phoenix, AZ 85008",lat:33.4494,lng:-111.9468,desc:"Animal encounters, games, science experiments and conservation activities straight from Phoenix Zoo specialists.",schedule:"Mon–Fri, 8am–3pm",web:"https://phoenixzoo.org/camps",phone:"(602) 914-4333",extras:"Limited spots — register early. Behind-the-scenes animal access.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:10,name:"Desert Botanical Garden Discovery Camp",org:"Desert Botanical Garden",type:"Outdoor",ages:"6-12",cost:"$310/wk",costNum:310,dates:"June 2 – July 18",startDate:"2025-06-02",endDate:"2025-07-18",address:"1201 N Galvin Pkwy, Phoenix, AZ 85008",lat:33.4614,lng:-111.9446,desc:"Explore the beauty of the Sonoran Desert through outdoor skills, nature-inspired art, sustainability, and science.",schedule:"Mon–Fri, 8am–12pm",web:"https://dbg.org",phone:"(480) 941-1225",extras:"All activities included with camp fee.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:11,name:"Cactus Day Camp",org:"Cactus Day Camp",type:"Outdoor",ages:"4-13",cost:"$425/wk",costNum:425,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Cave Creek area, Phoenix Metro",lat:33.8300,lng:-112.0000,desc:"ACA-accredited traditional day camp inspiring active, unplugged lifestyles in the beautiful Arizona desert.",schedule:"Mon–Fri, 7am–5:30pm",web:"https://cactusdaycamp.com",extras:"American Camp Association accredited. Sibling discounts available.",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:12,name:"Camp Colley Outdoor Adventure",org:"City of Phoenix Parks",type:"Outdoor",ages:"7-17",cost:"$500/wk",costNum:500,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"Happy Jack, AZ (Mogollon Rim)",lat:34.2800,lng:-111.3200,desc:"30-acre outdoor adventure camp on the Mogollon Rim. Nature education, hiking, leadership skills, and lifelong friendships away from the Phoenix heat.",schedule:"Mon–Fri, overnight sessions",web:"https://phoenix.gov/parks",extras:"Teen Leadership CIT program ages 16-17. Inclusive for neurodiverse youth.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:13,name:"Phoenix Herpetological Sanctuary Camp",org:"Phoenix Herpetological Sanctuary",type:"Outdoor",ages:"5-14",cost:"$350/wk",costNum:350,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Near Scottsdale Rd & Dynamite, Scottsdale",lat:33.7200,lng:-111.9100,desc:"Passionate reptile and amphibian conservation camp. Kids get up-close encounters with native and exotic species.",schedule:"Full day and half day options",web:"https://phoenixherp.com",phone:"(480) 513-4377",extras:"Address provided after registration. 3 age groups: Neonate, Junior, Advanced.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:14,name:"Camps for Kids AZ",org:"Camps for Kids",type:"Outdoor",ages:"5-17",cost:"$399/wk",costNum:399,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple Valley locations",lat:33.5500,lng:-112.1000,desc:"Arizona's most active themed camps — Animal, Water, LEGO, Cosmic Glow, and Gaming camps. Overnight options also available.",schedule:"Mon–Fri, 7am–6pm",web:"https://summercampaz.com",extras:"Day and overnight options. Wildly popular — book early!",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:15,name:"Children's Museum of Phoenix Camp",org:"Children's Museum of Phoenix",type:"Arts",ages:"5-8",cost:"$345/wk",costNum:345,dates:"May 26 – July 31",startDate:"2025-05-26",endDate:"2025-07-31",address:"215 N 7th St, Phoenix, AZ 85034",lat:33.4530,lng:-112.0600,desc:"Award-winning themed weekly camps covering nature, science, teamwork, and creativity. Explore three floors of imaginative exhibits.",schedule:"Mon–Fri, 9am–3pm",web:"https://childrensmuseumofphoenix.org",phone:"(602) 253-0501",extras:"Extended care $100/wk. Member discount available. Scholarships offered.",extCare:true,beforeCare:false,afterCare:true,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:16,name:"Phoenix Youth Circus Arts Camp",org:"Phoenix Youth Circus",type:"Arts",ages:"7-16",cost:"$350/wk",costNum:350,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"330 N 16th Ave, Phoenix, AZ 85007",lat:33.4590,lng:-112.0930,desc:"Learn stilt-walking, unicycling, juggling, trapeze, aerial silks, acrobatics and clowning from experienced teaching artists.",schedule:"Mon–Fri, 9am–4pm",web:"https://phxyouthcircus.org",extras:"Groups of 8 or less. Family showcase each Friday.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:17,name:"Desert Foothills Theater Camp",org:"Desert Foothills Theater",type:"Arts",ages:"4-17",cost:"$280/wk",costNum:280,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Two Valley locations",lat:33.8000,lng:-111.9500,desc:"Acting, dancing, music, crafts and dance parties in a supportive creative environment. 12 fun sessions across two locations.",schedule:"Mon–Fri, 9am–3pm",web:"https://dftheater.org",extras:"Two locations. One of the most popular theater camps in the Valley.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:18,name:"Scottsdale Desert Stages Theatre Camp",org:"Desert Stages Theatre",type:"Arts",ages:"4-18",cost:"$345/wk",costNum:345,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"7014 E Camelback Rd, Scottsdale, AZ 85251",lat:33.5028,lng:-111.9261,desc:"Award-winning non-profit performing arts theatre camp. Acting, singing, and dancing in Scottsdale Fashion Square.",schedule:"Mon–Fri, 9am–3pm",web:"https://desertstages.org",phone:"(480) 348-0110",extras:"Professional instruction. Family showcase at end of session.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:19,name:"BE KIND Summer Camp",org:"The BE KIND People Project",type:"Academic",ages:"5-14",cost:"$200/wk",costNum:200,dates:"June 2 – June 26",startDate:"2025-06-02",endDate:"2025-06-26",address:"731 Grand Ave, Phoenix, AZ 85007",lat:33.4620,lng:-112.0820,desc:"Unique character-building camps centered on kindness, leadership, and responsibility. Dance, video creation, visual arts, and community service.",schedule:"Mon–Thu, 9am–3:30pm",web:"https://thebekindpeopleproject.org/summer-camps",phone:"(602) 559-9399",extras:"Before/after care +$80/wk. Spots fill fast — register early.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:20,name:"Saint Barnabas Arts Camp",org:"Saint Barnabas Episcopal Church",type:"Arts",ages:"5-15",cost:"$150/wk",costNum:150,dates:"June 9 – July 11",startDate:"2025-06-09",endDate:"2025-07-11",address:"Phoenix, AZ",lat:33.5100,lng:-112.0400,desc:"Affordable fine arts camp exploring visual arts, music, drama, and creativity in a welcoming community environment.",schedule:"Mon–Fri, 9am–noon",extras:"One of the most affordable arts camps in Phoenix.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:21,name:"Phoenix Suns Basketball Camp",org:"Phoenix Suns",type:"Sports",ages:"6-17",cost:"$299/wk",costNum:299,dates:"June 2 – June 27",startDate:"2025-06-02",endDate:"2025-06-27",address:"Multiple Valley locations",lat:33.4457,lng:-112.0712,desc:"Official Suns camp with professional coaching, drills, skills sessions and scrimmages. Four locations across the Valley.",schedule:"Mon–Fri, 9am–3pm",web:"https://suns.com/camps",extras:"4 sessions at different Valley locations. Jersey included.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:22,name:"Challenger Sports Soccer Camp",org:"Challenger Sports",type:"Sports",ages:"3-14",cost:"$180/wk",costNum:180,dates:"June 9 – Aug 1",startDate:"2025-06-09",endDate:"2025-08-01",address:"Various Phoenix area fields",lat:33.5722,lng:-112.0893,desc:"North America's largest soccer camp provider with 30+ years of experience. International coaching staff with fun, skills-focused training.",schedule:"Mon–Fri, 9am–12pm or 2pm–5pm",web:"https://challengersports.com",extras:"Ball + backpack included. All ability levels.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:23,name:"Impact Gymnastics Camp",org:"Impact Gymnastics Academy",type:"Sports",ages:"4-14",cost:"$300/wk",costNum:300,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"7812 N 12th St, Phoenix, AZ 85020",lat:33.5810,lng:-112.0630,desc:"Full and half-day gymnastics camps with tumbling, trampoline, obstacle courses, team sports and relay races.",schedule:"Mon–Fri, 9am–3pm (full) or 9am–noon (half)",web:"https://impactgymaz.com",extras:"Full day $400/wk or $85/day. Half day $300/wk or $65/day.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:24,name:"Xtreme Gymnastics Fit-n-Fun Camp",org:"Xtreme Gymnastics",type:"Sports",ages:"3-12",cost:"$78/wk",costNum:78,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"14000 N Hayden Rd, Scottsdale, AZ 85260",lat:33.6310,lng:-111.9080,desc:"Gymnastics, trampolining, obstacle courses, team sports, relay races and inflatables promoting health and fitness.",schedule:"Multiple daily session times",web:"https://xtremegymnastics.com",extras:"Prices start at $78. One of the most affordable sports camps.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:25,name:"Rancho Solano Summer Camp",org:"Rancho Solano Preparatory School",type:"Sports",ages:"3-12",cost:"$375/wk",costNum:375,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"9180 E Via de Ventura, Scottsdale, AZ 85258",lat:33.5600,lng:-111.8900,desc:"Award-winning day camp with daily swimming included. Drone racing, STEM, arts, sports, Roblox, Minecraft and more.",schedule:"Mon–Fri, 7:30am–5:30pm",web:"https://ranchosummercamps.com",extras:"Swimming, extended care and snack ALL included. PreK–8th grade.",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:26,name:"Paradise Valley Karate Camp",org:"Paradise Valley School of Karate",type:"Sports",ages:"5-14",cost:"$199/wk",costNum:199,dates:"May 27 – Aug 1",startDate:"2025-05-27",endDate:"2025-08-01",address:"Paradise Valley, AZ",lat:33.5400,lng:-111.9600,desc:"Martial arts camp teaching discipline, focus, respect, and confidence through fun age-appropriate instruction.",schedule:"Mon–Fri, 9am–3pm",extras:"Beginner-friendly. Character development focus.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:27,name:"Valley Youth Theatre Summer Camp",org:"Valley Youth Theatre",type:"Music",ages:"6-18",cost:"$375/wk",costNum:375,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"525 N 1st St, Phoenix, AZ 85004",lat:33.4523,lng:-112.0707,desc:"Professional musical theatre training in voice, movement, and acting. Campers perform in a full production at end of session.",schedule:"Mon–Fri, 9am–3pm",web:"https://vyt.com",phone:"(602) 253-8188",extras:"Scholarships available. Notable alumni include Emma Stone.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:true,registrationOpen:false,reviews:[]},
  {id:28,name:"Phoenix Theatre Children's Camp",org:"Phoenix Theatre Company",type:"Arts",ages:"8-17",cost:"$425/wk",costNum:425,dates:"June 23 – July 11",startDate:"2025-06-23",endDate:"2025-07-11",address:"1825 N Central Ave, Phoenix, AZ 85004",lat:33.4793,lng:-112.0740,desc:"Professional theater training in acting, singing, and dance led by Phoenix Theatre Company artists.",schedule:"Mon–Fri, 9am–4pm",web:"https://phoenixtheatre.com",extras:"Costumes provided. Professional-grade instruction.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:false,reviews:[]},
  {id:29,name:"YMCA Dance & Cheer Camp",org:"Valley of the Sun YMCA",type:"Dance",ages:"5-14",cost:"$190/wk",costNum:190,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"Multiple YMCA locations",lat:33.4901,lng:-112.1100,desc:"High-energy dance and cheer covering hip-hop, jazz, pom, and cheerleading. Week ends with a family performance.",schedule:"Mon–Fri, 9am–12pm",web:"https://valleyofthesunymca.org",extras:"Before/after care available at many locations.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:30,name:"Boys & Girls Club Summer Camp",org:"Boys & Girls Clubs of the Valley",type:"Academic",ages:"5-18",cost:"$50/wk",costNum:50,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"31 locations across the Valley",lat:33.4700,lng:-112.0500,desc:"Affordable, enriching summer programs covering arts, sciences, and sports. Healthy breakfast, snacks, and lunch included.",schedule:"Mon–Fri, 6am–6pm",web:"https://bgcaz.org/summer-camp",phone:"(602) 433-2490",extras:"Meals included! One of the best-value camps in the Valley. 31 locations.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:31,name:"Boys & Girls Clubs of Greater Scottsdale",org:"Boys & Girls Clubs of Greater Scottsdale",type:"Academic",ages:"5-18",cost:"$60/wk",costNum:60,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"4 Scottsdale/Phoenix locations",lat:33.5800,lng:-111.9200,desc:"Arts, sciences and sports programs in a safe, supportive environment. Leadership and career-building experiences for teens.",schedule:"Mon–Fri, 7am–6pm",web:"https://bgcs.org",phone:"(480) 344-5520",extras:"4 locations: Ridgeline, Thunderbirds, Virginia Piper, Vestar branches.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:32,name:"Deer Valley USD Sunsational Camps",org:"Deer Valley Unified School District",type:"Academic",ages:"4-14",cost:"$115/wk",costNum:115,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Multiple DVUSD schools, Peoria/Phoenix",lat:33.6800,lng:-112.1500,desc:"Wide variety of camps including sports, arts, music, STEM, theater, and field trips. STEAM projects and Science Center field trips included.",schedule:"Mon–Fri, 6am–6pm",web:"https://dvusd.org/summerprograms",extras:"$115 for 3 days or $185 for 5 days. Breakfast, snacks and lunch included.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:33,name:"Summit School Summer Camp",org:"Summit School of Ahwatukee",type:"Academic",ages:"4-12",cost:"$250/wk",costNum:250,dates:"May 27 – July 3",startDate:"2025-05-27",endDate:"2025-07-03",address:"4515 E Muirwood Dr, Phoenix, AZ 85048",lat:33.3100,lng:-112.0000,desc:"Six weeks of fun themed camps: Science, Dino, Under the Sea, Pirate, Camp Olympics, and LEGO. Creative hands-on learning.",schedule:"Mon–Fri, 7am–6pm",web:"https://summitschoolaz.org/summer-camps",phone:"(480) 403-9500",extras:"Open to all students, not just Summit enrollees.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:34,name:"Peoria Parks Summer Camp",org:"City of Peoria Parks & Recreation",type:"Outdoor",ages:"5-12",cost:"$185/wk",costNum:185,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Multiple Peoria park locations",lat:33.5806,lng:-112.2374,desc:"STEAM projects, daily field trips to the Arizona Science Center, arts, and sports. A well-rounded affordable camp program.",schedule:"Mon–Fri, 6am–6pm",web:"https://peoriaaz.gov",extras:"$115 for 3 days or $185 for 5 days. Meals included.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:35,name:"ASU Summer Camp Programs",org:"Arizona State University",type:"Academic",ages:"8-17",cost:"$400/wk",costNum:400,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"13590 N 47th Ave, Phoenix, AZ 85029",lat:33.6100,lng:-112.1400,desc:"University-level hands-on STEM and enrichment camps on ASU West Valley campus. Eight themed camps with critical thinking and project-based learning.",schedule:"Mon–Fri, 9am–4pm",web:"https://asu.edu/summercamp",extras:"Snacks and water provided. Parents view completed projects each week.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:36,name:"Camp OCEAN at OdySea Aquarium",org:"OdySea Aquarium",type:"Outdoor",ages:"5-13",cost:"$375/wk",costNum:375,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"9500 E Via de Ventura, Scottsdale, AZ 85256",lat:33.5400,lng:-111.8900,desc:"Behind-the-scenes aquarium camp with animal encounters, marine biology lessons, and conservation activities.",schedule:"Mon–Fri, 9am–3pm",web:"https://odyseaaquarium.com/campocean",phone:"(480) 291-8193",extras:"Voted Best of the Valley Day Camp 2025. Very limited spots — book early!",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:true,registrationOpen:true,reviews:[]},
  {id:37,name:"Camp Kroc",org:"The Salvation Army Kroc Center",type:"Outdoor",ages:"5-13",cost:"$220/wk",costNum:220,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"1375 E Broadway Rd, Phoenix, AZ 85040",lat:33.3960,lng:-112.0430,desc:"Action-packed camp with swimming, rock climbing, arts & crafts, cooking experiments, and sports. Week ends with a Splashtastic Pool Party!",schedule:"Mon–Fri, 7am–6pm",web:"https://krocphoenix.org/camp-kroc",phone:"(602) 352-5762",extras:"Breakfast and lunch included. Scholarships available (up to 50% off).",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:38,name:"Shemesh Day Camp",org:"Valley of the Sun Jewish Community Center",type:"Outdoor",ages:"5-16",cost:"$375/wk",costNum:375,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"12701 N Scottsdale Rd, Scottsdale, AZ 85254",lat:33.6100,lng:-111.9200,desc:"ACA-accredited day camp with swim lessons, archery, sports, art, STEAM, and tween adventures.",schedule:"Mon–Fri, 7:30am–5:30pm",web:"https://valleyofthesunj.org/shemesh",phone:"(480) 634-4949",extras:"ACA accredited. All staff CPR/First Aid certified.",extCare:true,beforeCare:true,afterCare:true,springBreak:true,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:39,name:"Sunrays Summer Camp",org:"Sunrays Summer Camp",type:"Sports",ages:"4-12",cost:"$290/wk",costNum:290,dates:"May 27 – Aug 8",startDate:"2025-05-27",endDate:"2025-08-08",address:"15801 N 32nd St, Phoenix, AZ 85032",lat:33.6300,lng:-112.0000,desc:"Action-packed camp with ninja training, gymnastics, sports games, water play, obstacle courses, and creative crafts.",schedule:"Mon–Fri, 8am–3pm",web:"https://sunrayssummercamp.com",extras:"Extended care available. Multiple weekly themes.",extCare:true,beforeCare:false,afterCare:true,springBreak:true,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:40,name:"APEX Sports Camp",org:"APEX Sports Camps",type:"Sports",ages:"6-14",cost:"$250/wk",costNum:250,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"4633 E Shea Blvd, Phoenix, AZ 85028",lat:33.5800,lng:-111.9800,desc:"22,000 sq ft climate-controlled sports facility with basketball, volleyball, pickleball, dodgeball, NERF football, and chess.",schedule:"Mon–Fri, 9am–3pm",extras:"Climate controlled — perfect for Phoenix summers. All sports equipment included.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:41,name:"Orme Summer Camp",org:"Orme School",type:"Outdoor",ages:"12-17",cost:"$1100/wk",costNum:1100,dates:"July 13 – July 27",startDate:"2025-07-13",endDate:"2025-07-27",address:"1000 E Orme School Rd, Mayer, AZ 86333",lat:34.4100,lng:-112.3100,desc:"Teen adventure camp on a stunning historic campus with equestrian facilities, competition pool, gymnasium, and hiking trails.",schedule:"Overnight sessions July 13–19 (ages 12–14) and July 21–27 (ages 15–17)",web:"https://ormeschool.org",extras:"Horseback riding, hiking, swimming, and more.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:42,name:"McCormick Stillman Railroad Park Camp",org:"City of Scottsdale",type:"Outdoor",ages:"5-12",cost:"$195/wk",costNum:195,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"7301 E Indian Bend Rd, Scottsdale, AZ 85250",lat:33.5700,lng:-111.9200,desc:"Unique camp at Scottsdale's beloved railroad park. Train rides, outdoor science, crafts, and games.",schedule:"Mon–Fri, 8am–noon",web:"https://scottsdaleaz.gov/parks",extras:"Train rides included! One of Scottsdale's most unique camp experiences.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:43,name:"Childsplay Theatre Academy Camp",org:"Childsplay",type:"Arts",ages:"4-17",cost:"$340/wk",costNum:340,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"900 S Mitchell Dr, Tempe, AZ 85281",lat:33.4200,lng:-111.9400,desc:"Award-winning theatre camp led by professional artists. Creative drama, acting workshops, stage combat, and musical theatre.",schedule:"Mon–Fri, 9am–3pm",web:"https://childsplayaz.org",phone:"(480) 350-8101",extras:"Professional AEA actors as instructors. Tempe's premier youth theatre program.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:44,name:"Young Rembrandts Art Camp",org:"Young Rembrandts",type:"Arts",ages:"4-12",cost:"$199/wk",costNum:199,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple East Valley locations",lat:33.4500,lng:-111.8500,desc:"Nationally recognized art education program teaching drawing, design, and creativity through a proven step-by-step curriculum.",schedule:"Mon–Fri, 9am–noon or 1pm–4pm",web:"https://youngrembrandts.com/az-east-valley",extras:"Multiple East Valley locations. Half-day format.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:45,name:"Art and Sol Performing Arts Camp",org:"Art and Sol",type:"Dance",ages:"5-15",cost:"$310/wk",costNum:310,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Chandler, AZ 85225",lat:33.3062,lng:-111.8413,desc:"Performing arts camp blending acting, music, and dance for beginners and experienced performers alike.",schedule:"Mon–Fri, 9am–3pm",web:"https://artandsolaz.com",extras:"Great for first-timers and experienced performers. Family showcase at end of session.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:46,name:"Aspire Kids Sports Center Camp",org:"Aspire Kids Sports Center",type:"Sports",ages:"4-14",cost:"$320/wk",costNum:320,dates:"May 22 – Aug 8",startDate:"2025-05-22",endDate:"2025-08-08",address:"50 S Hearthstone Way, Chandler, AZ 85226",lat:33.3000,lng:-111.8800,desc:"Dynamic summer camps featuring gymnastics, swimming, dance, and more. Varied physical activities designed to promote fitness and fun.",schedule:"Mon–Fri, 8am–3pm",web:"https://aspirekidssportscenter.com",extras:"Gymnastics, swimming and dance all in one camp. Chandler location.",extCare:false,beforeCare:false,afterCare:false,springBreak:true,singleDay:true,featured:false,registrationOpen:true,reviews:[]},
  {id:47,name:"Tempe Parks Summer Camp",org:"City of Tempe Parks & Recreation",type:"Outdoor",ages:"6-13",cost:"$150/wk",costNum:150,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Multiple Tempe park locations",lat:33.4255,lng:-111.9400,desc:"Affordable city-run camps with swimming, sports, arts, field trips and more. One of the best deals in the East Valley.",schedule:"Mon–Fri, 7am–6pm",web:"https://tempe.gov/parks",phone:"(480) 350-5200",extras:"Financial assistance available. Multiple park locations.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:48,name:"Gilbert Parks Summer Camp",org:"Town of Gilbert Parks & Recreation",type:"Outdoor",ages:"5-13",cost:"$170/wk",costNum:170,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Multiple Gilbert locations",lat:33.3528,lng:-111.7890,desc:"Fun-filled camp days with swimming, sports, arts, field trips, and outdoor activities across Gilbert's beautiful park system.",schedule:"Mon–Fri, 6:30am–6pm",web:"https://gilbertaz.gov/parks",extras:"Gilbert residents get discounted rates.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:49,name:"Mesa Parks Summer Camp",org:"City of Mesa Parks & Recreation",type:"Outdoor",ages:"6-13",cost:"$160/wk",costNum:160,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple Mesa park locations",lat:33.4152,lng:-111.8315,desc:"Classic summer day camp featuring swimming, sports, arts & crafts, field trips, and outdoor games.",schedule:"Mon–Fri, 7am–6pm",web:"https://mesaparks.com",phone:"(480) 644-2352",extras:"Mesa residents discounted. Multiple locations.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:50,name:"Chandler Parks Summer Camp",org:"City of Chandler Parks & Recreation",type:"Outdoor",ages:"5-13",cost:"$175/wk",costNum:175,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Multiple Chandler locations",lat:33.3062,lng:-111.8413,desc:"Summer day camps with swimming, sports, arts, and field trips. Well-run city program known for great counselors and safe facilities.",schedule:"Mon–Fri, 6:30am–6pm",web:"https://chandleraz.gov/parks",extras:"Resident rates available. Free bus transportation to/from some school sites.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:51,name:"Scottsdale Parks Camp",org:"City of Scottsdale Parks & Recreation",type:"Outdoor",ages:"5-13",cost:"$200/wk",costNum:200,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"Multiple Scottsdale park locations",lat:33.4942,lng:-111.9261,desc:"Quality city-run camp with swimming, hiking, arts, sports, and field trips. Well-regarded program with experienced staff.",schedule:"Mon–Fri, 7am–5:30pm",web:"https://scottsdaleaz.gov/parks",extras:"Scottsdale residents get priority registration.",extCare:true,beforeCare:true,afterCare:true,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:52,name:"Peoria Sports Complex Baseball Camp",org:"Peoria Sports Complex",type:"Sports",ages:"7-16",cost:"$275/wk",costNum:275,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"16101 N 83rd Ave, Peoria, AZ 85382",lat:33.6200,lng:-112.2400,desc:"Train on the same fields as the MLB Padres and Mariners spring training facility. Professional instruction for all skill levels.",schedule:"Mon–Fri, 8am–noon",web:"https://peoriasportscomplex.com",extras:"Play on MLB spring training fields! All equipment provided.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:53,name:"Phoenix Mercury Basketball Camp",org:"Phoenix Mercury / Suns",type:"Sports",ages:"8-16",cost:"$275/wk",costNum:275,dates:"June 16 – June 27",startDate:"2025-06-16",endDate:"2025-06-27",address:"Phoenix Suns Arena / Valley locations",lat:33.4457,lng:-112.0712,desc:"Official Phoenix Mercury camp teaching fundamental basketball skills with professional coaching. Drills, scrimmages and player meet-and-greets.",schedule:"Mon–Fri, 9am–3pm",web:"https://mercury.wnba.com",extras:"Girls basketball focus. Meet WNBA players!",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:54,name:"AZ Coyotes Hockey Camp",org:"Arizona Coyotes",type:"Sports",ages:"5-18",cost:"$425/wk",costNum:425,dates:"June 9 – July 18",startDate:"2025-06-09",endDate:"2025-07-18",address:"Scottsdale Ice Den, 9375 E Bell Rd, Scottsdale, AZ 85260",lat:33.6400,lng:-111.8800,desc:"Official AZ Coyotes hockey development camps for all skill levels at Scottsdale Ice Den. Beat the Phoenix heat on the ice!",schedule:"Mon–Fri, varies by session",web:"https://coyotes.nhl.com/camps",extras:"Beat the Phoenix heat on the ice! All skill levels.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
  {id:55,name:"Phoenix Art Museum Junior Artists Camp",org:"Phoenix Art Museum",type:"Arts",ages:"6-14",cost:"$350/wk",costNum:350,dates:"June 9 – July 18",startDate:"2025-06-09",endDate:"2025-07-18",address:"1625 N Central Ave, Phoenix, AZ 85004",lat:33.4680,lng:-112.0740,desc:"Immersive art museum camp where kids explore world-class galleries and create their own works inspired by the permanent collection.",schedule:"Mon–Fri, 9am–3pm",web:"https://phxart.org",phone:"(602) 257-1222",extras:"Gallery access included. All materials provided. Member discounts.",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false,featured:false,registrationOpen:true,reviews:[]},
];

const avg = r => r.length ? (r.reduce((s,x)=>s+x.rating,0)/r.length).toFixed(1) : null;
const parseCost = (cost,f) => {
  if(f==="Any Cost") return true;
  const n=parseInt((cost||"").replace(/[^0-9]/g,""));
  if(f==="Free") return n===0;
  if(f==="Under $200/wk") return n<200;
  if(f==="$200-$400/wk") return n>=200&&n<=400;
  if(f==="$400-$600/wk") return n>400&&n<=600;
  if(f==="$600+/wk") return n>600;
  return true;
};
const ageMatch = (a,f) => {
  if(f==="All Ages") return true;
  const [fMin,fMax]=f.split("-").map(Number);
  const [cMin,cMax]=(a||"").split("-").map(Number);
  return cMin<=(fMax||fMin)&&(cMax||cMin)>=fMin;
};
const timeMatch = (c,f) => {
  if(f==="Any Schedule") return true;
  if(f==="Extended Care") return c.extCare;
  if(f==="Before Care") return c.beforeCare;
  if(f==="After Care") return c.afterCare;
  if(f==="Spring Break") return c.springBreak;
  if(f==="Single Day OK") return c.singleDay;
  if(f==="Full Day (8h+)") return /7am|7:30|8am|full/i.test(c.schedule||"");
  if(f==="Half Day") return /12pm|half|noon/i.test(c.schedule||"");
  return true;
};
const distMiles = (lat1,lng1,lat2,lng2) => {
  const R=3958.8,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
};
const getCampUrl = id => `${window.location.href.split("?")[0]}?camp=${id}`;
const getHighlightedId = () => { try { return parseInt(new URLSearchParams(window.location.search).get("camp"))||null; } catch { return null; } };

const exportToICal = (camp) => {
  const fmt = d => d.replace(/-/g,"");
  const ical = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Campful//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",`UID:campful-${camp.id}@campful.app`,
    `DTSTART;VALUE=DATE:${fmt(camp.startDate||"2025-06-02")}`,
    `DTEND;VALUE=DATE:${fmt(camp.endDate||"2025-08-08")}`,
    `SUMMARY:${camp.name}`,`DESCRIPTION:${camp.desc}\\nSchedule: ${camp.schedule||""}\\nCost: ${camp.cost||""}\\nWebsite: ${camp.web||""}`,
    `LOCATION:${camp.address}`,"STATUS:CONFIRMED","END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([ical],{type:"text/calendar"}));
  a.download=`${camp.name.replace(/[^a-z0-9]/gi,"_")}.ics`; a.click();
};
const exportAllToICal = (camps) => {
  const fmt = d => d.replace(/-/g,"");
  const events = camps.map(c=>["BEGIN:VEVENT",`UID:campful-${c.id}@campful.app`,
    `DTSTART;VALUE=DATE:${fmt(c.startDate||"2025-06-02")}`,`DTEND;VALUE=DATE:${fmt(c.endDate||"2025-08-08")}`,
    `SUMMARY:${c.name}`,`LOCATION:${c.address}`,"STATUS:CONFIRMED","END:VEVENT"].join("\r\n")).join("\r\n");
  const ical=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Campful//EN\r\n${events}\r\nEND:VCALENDAR`;
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([ical],{type:"text/calendar"}));
  a.download="campful_summer.ics"; a.click();
};

const S = {
  input: {width:"100%",border:`1.5px solid #E8D5A0`,borderRadius:10,padding:"9px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",background:"white",color:"#2D1A08",boxSizing:"border-box",outline:"none"},
  btn: (active,color=BLUE) => ({padding:"8px 16px",borderRadius:20,border:active?"none":`1.5px solid #E8D5A0`,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.15s",background:active?color:"white",color:active?"white":"#92600A"}),
  pill: (active,ts) => ({padding:"7px 16px",borderRadius:20,border:"none",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",
    background:active?(ts?.dot||BLUE):"white",color:active?"white":"#92600A",
    boxShadow:active?`0 3px 12px ${ts?.dot||BLUE}44`:"0 1px 3px rgba(0,0,0,0.06)",
    border:active?"none":`1.5px solid #E8D5A0`,transform:active?"translateY(-1px)":"none"}),
};

const Stars = ({rating,interactive=false,onRate,size=18}) => {
  const [hover,setHover]=useState(0);
  return <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(s=>(
      <span key={s} onClick={()=>interactive&&onRate&&onRate(s)}
        onMouseEnter={()=>interactive&&setHover(s)} onMouseLeave={()=>interactive&&setHover(0)}
        style={{fontSize:size,cursor:interactive?"pointer":"default",color:(hover||rating)>=s?"#F59E0B":"#E5E7EB",lineHeight:1}}>★</span>
    ))}
  </span>;
};

const ReviewModal = ({camp,onClose,onSubmit}) => {
  const [name,setName]=useState(""); const [rating,setRating]=useState(0);
  const [text,setText]=useState(""); const [childAge,setChildAge]=useState(""); const [year,setYear]=useState("2025");
  const submit=()=>{
    if(!name.trim()||!rating||!text.trim()){alert("Please fill in your name, a rating, and a review.");return;}
    onSubmit({name,rating,text,childAge,year,date:new Date().toLocaleDateString()}); onClose();
  };
  const lbl={display:"block",fontSize:11,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(146,64,14,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,padding:28,width:"100%",maxWidth:440,boxShadow:"0 30px 80px rgba(146,64,14,0.3)"}}>
        <h3 style={{margin:"0 0 4px",fontSize:22,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Leave a Review</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>YOUR NAME</label><input style={S.input} placeholder="e.g. Sarah M." value={name} onChange={e=>setName(e.target.value)}/></div>
          <div><label style={lbl}>RATING</label><Stars rating={rating} interactive onRate={setRating} size={28}/>
            {rating>0&&<p style={{margin:"4px 0 0",fontSize:12,color:BLUE,fontFamily:"'DM Sans',sans-serif"}}>{["","Poor","Fair","Good","Great","Excellent!"][rating]}</p>}
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>CHILD'S AGE</label><input style={S.input} placeholder="e.g. 8" value={childAge} onChange={e=>setChildAge(e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>YEAR</label>
              <select style={S.input} value={year} onChange={e=>setYear(e.target.value)}>
                {["2025","2024","2023","2022"].map(y=><option key={y}>{y}</option>)}</select></div>
          </div>
          <div><label style={lbl}>YOUR REVIEW</label><textarea style={{...S.input,height:90,resize:"none"}} placeholder="What did your child love? How were the staff?" value={text} onChange={e=>setText(e.target.value)}/></div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
            <button onClick={submit} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Submit ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertModal = ({camp,onClose}) => {
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false);
  const subject=encodeURIComponent(`Alert me when ${camp.name} opens registration`);
  const body=encodeURIComponent(`Hi,\n\nPlease notify me when registration opens for:\n\n${camp.name}\n${camp.dates}\n${camp.address}\n\nMy email: ${email}\n\nThanks!`);
  const mailto=camp.web?`mailto:info@${camp.web.replace(/https?:\/\//,"").split("/")[0]}?subject=${subject}&body=${body}`:null;
  const handle=()=>{
    if(!email.trim()||!email.includes("@")){alert("Please enter a valid email.");return;}
    if(mailto) window.open(mailto,"_blank"); setSent(true);
  };
  const lbl={display:"block",fontSize:11,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(146,64,14,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,padding:28,width:"100%",maxWidth:420,boxShadow:"0 30px 80px rgba(146,64,14,0.3)"}}>
        {!sent?<>
          <div style={{fontSize:36,marginBottom:8}}>🔔</div>
          <h3 style={{margin:"0 0 4px",fontSize:20,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Registration Alert</h3>
          <p style={{margin:"0 0 6px",fontSize:14,fontWeight:600,color:"#2D1A08",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</p>
          <p style={{margin:"0 0 20px",fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>
            {camp.registrationOpen?"🟢 Registration is open! Visit the website to sign up now.":"Registration isn't open yet. We'll help you send a request to the camp."}
          </p>
          {camp.registrationOpen?(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {camp.web&&<a href={camp.web} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:"12px 0",borderRadius:12,background:BLUE,color:"white",textAlign:"center",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",textDecoration:"none"}}>Register Now →</a>}
              <button onClick={onClose} style={{...S.btn(false),width:"100%",padding:"11px 0",borderRadius:12}}>Close</button>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={lbl}>YOUR EMAIL</label><input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
              <p style={{margin:0,fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>💡 Opens your email app with a pre-filled message to the camp.</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
                <button onClick={handle} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Send Request</button>
              </div>
            </div>
          )}
        </>:(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Alert set!</h3>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>Your email app should have opened. You'll be first to know when registration opens!</p>
            <button onClick={onClose} style={{...S.btn(true),width:"100%",padding:"12px 0",borderRadius:12,fontSize:13}}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleBuilder = ({savedCamps,onToggleSave,onClose}) => {
  const totalCost=savedCamps.reduce((s,c)=>s+(c.costNum||0),0);
  const WEEKS=[
    {label:"June 2–6",start:"2025-06-02"},{label:"June 9–13",start:"2025-06-09"},
    {label:"June 16–20",start:"2025-06-16"},{label:"June 23–27",start:"2025-06-23"},
    {label:"July 7–11",start:"2025-07-07"},{label:"July 14–18",start:"2025-07-14"},
    {label:"July 21–25",start:"2025-07-21"},{label:"July 28–Aug 1",start:"2025-07-28"},
    {label:"Aug 4–8",start:"2025-08-04"},
  ];
  const campForWeek=w=>savedCamps.find(c=>c.startDate&&c.endDate&&w.start>=c.startDate&&w.start<=c.endDate);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(146,64,14,0.65)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:680,boxShadow:"0 30px 80px rgba(146,64,14,0.3)",margin:"auto",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,#92400E,#F59E0B)`,padding:"24px 28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <h2 style={{margin:"0 0 4px",fontSize:24,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white"}}>📅 Summer Schedule</h2>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif"}}>Build your family's perfect summer</p>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>✕ Close</button>
          </div>
          {savedCamps.length>0&&(
            <div style={{marginTop:16,display:"flex",gap:12,flexWrap:"wrap"}}>
              {[["CAMPS SAVED",savedCamps.length],["EST. COST",`$${totalCost.toLocaleString()}`]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"8px 16px"}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.05em"}}>{l}</div>
                  <div style={{fontSize:22,fontWeight:900,color:"white",fontFamily:"'Fraunces',serif"}}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{padding:28}}>
          <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Weekly View</h3>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:24}}>
            {WEEKS.map(week=>{
              const camp=campForWeek(week);
              const ts=camp?TYPE_STYLE[camp.type]:null;
              return (
                <div key={week.label} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:110,fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>{week.label}</div>
                  <div style={{flex:1,borderRadius:10,padding:"9px 14px",background:camp?(ts?.bg||BLUE_LIGHT):SKY,border:`1.5px solid ${camp?(ts?.dot||BLUE):"#E8D5A0"}`,display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:38}}>
                    {camp?(<>
                      <span style={{fontSize:13,fontWeight:700,color:ts?.fg||"#2D1A08",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</span>
                      <button onClick={()=>onToggleSave(camp)} style={{fontSize:11,padding:"3px 10px",borderRadius:8,border:"none",background:"rgba(0,0,0,0.08)",color:ts?.fg||"#2D1A08",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Remove</button>
                    </>):(
                      <span style={{fontSize:12,color:"#D4B896",fontFamily:"'DM Sans',sans-serif"}}>Free week — add a camp below</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {savedCamps.length>0?(
            <>
              <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Saved Camps</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {savedCamps.map(camp=>{
                  const ts=TYPE_STYLE[camp.type]||{};
                  return (
                    <div key={camp.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:SKY,borderRadius:12,border:`1.5px solid #E8D5A0`}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:ts.dot||BLUE,flexShrink:0,display:"inline-block"}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#2D1A08",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</div>
                        <div style={{fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>{camp.dates} · {camp.cost}</div>
                      </div>
                      <button onClick={()=>exportToICal(camp)} style={{...S.btn(false),fontSize:11,padding:"5px 10px",borderRadius:8,flexShrink:0}}>📅 iCal</button>
                      <button onClick={()=>onToggleSave(camp)} style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:"none",background:"#FFE4E6",color:"#9F1239",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>✕</button>
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>exportAllToICal(savedCamps)} style={{...S.btn(true),width:"100%",padding:"13px 0",borderRadius:12,fontSize:13}}>
                📅 Export All to Calendar
              </button>
              <p style={{margin:"8px 0 0",fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>Works with Google Calendar, Apple Calendar & Outlook</p>
            </>
          ):(
            <div style={{textAlign:"center",padding:24,background:SKY,borderRadius:14,border:`1.5px dashed #D4B896`}}>
              <div style={{fontSize:36,marginBottom:8}}>🌵</div>
              <p style={{margin:"0 0 4px",fontSize:15,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>No camps saved yet</p>
              <p style={{margin:0,fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>Hit 🏷️ on any camp card to save it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddCampModal = ({onClose,onAdd}) => {
  const [f,setF]=useState({name:"",org:"",type:"Sports",ages:"",cost:"",dates:"",startDate:"2025-06-02",endDate:"2025-08-08",address:"",desc:"",schedule:"",web:"",phone:"",extras:"",extCare:false,beforeCare:false,afterCare:false,springBreak:false,singleDay:false});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!f.name.trim()||!f.address.trim()||!f.desc.trim()){alert("Please fill in camp name, address, and description.");return;}
    onAdd({...f,id:Date.now(),reviews:[],featured:false,registrationOpen:false,costNum:parseInt(f.cost.replace(/[^0-9]/g,""))||0,lat:33.4484+Math.random()*0.3-0.15,lng:-112.0669+Math.random()*0.3-0.15});
    onClose();
  };
  const lbl={display:"block",fontSize:11,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(146,64,14,0.65)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,padding:28,width:"100%",maxWidth:520,boxShadow:"0 30px 80px rgba(146,64,14,0.3)",margin:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:22,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Add a Camp 🌵</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>Know a camp that's missing? Add it for the community!</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:2}}><label style={lbl}>CAMP NAME *</label><input style={S.input} placeholder="e.g. Desert Sun Art Camp" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>TYPE</label><select style={S.input} value={f.type} onChange={e=>set("type",e.target.value)}>{TYPES.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div><label style={lbl}>ORGANIZATION</label><input style={S.input} placeholder="e.g. Phoenix Parks & Rec" value={f.org} onChange={e=>set("org",e.target.value)}/></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>AGE RANGE</label><input style={S.input} placeholder="e.g. 6-12" value={f.ages} onChange={e=>set("ages",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>COST</label><input style={S.input} placeholder="e.g. $250/wk" value={f.cost} onChange={e=>set("cost",e.target.value)}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>START DATE</label><input style={S.input} type="date" value={f.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>END DATE</label><input style={S.input} type="date" value={f.endDate} onChange={e=>set("endDate",e.target.value)}/></div>
          </div>
          <div><label style={lbl}>ADDRESS *</label><input style={S.input} placeholder="e.g. 600 E Washington St, Phoenix" value={f.address} onChange={e=>set("address",e.target.value)}/></div>
          <div><label style={lbl}>HOURS / SCHEDULE</label><input style={S.input} placeholder="e.g. Mon–Fri, 9am–3pm" value={f.schedule} onChange={e=>set("schedule",e.target.value)}/></div>
          <div><label style={lbl}>DESCRIPTION *</label><textarea style={{...S.input,height:80,resize:"none"}} placeholder="What makes this camp special?" value={f.desc} onChange={e=>set("desc",e.target.value)}/></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>WEBSITE</label><input style={S.input} placeholder="https://..." value={f.web} onChange={e=>set("web",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>PHONE</label><input style={S.input} placeholder="(602) 555-0100" value={f.phone} onChange={e=>set("phone",e.target.value)}/></div>
          </div>
          <div><label style={lbl}>EXTRAS / NOTES</label><input style={S.input} placeholder="Scholarships, sibling discount, lunch included..." value={f.extras} onChange={e=>set("extras",e.target.value)}/></div>
          <div><label style={lbl}>OPTIONS</label>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {[["extCare","Extended Care"],["beforeCare","Before Care"],["afterCare","After Care"],["springBreak","Spring Break"],["singleDay","Single Day OK"]].map(([k,l])=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:"#2D1A08"}}>
                  <input type="checkbox" checked={f[k]} onChange={e=>set(k,e.target.checked)} style={{width:16,height:16,accentColor:BLUE}}/>{l}
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
            <button onClick={submit} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Add Camp ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapView = ({camps,onSelect}) => {
  const ref=useRef(null); const mapRef=useRef(null); const markersRef=useRef([]);
  useEffect(()=>{
    if(!ref.current) return;
    const init=()=>{
      if(mapRef.current) mapRef.current.remove();
      const map=window.L.map(ref.current).setView([33.4943,-112.0200],11);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      mapRef.current=map;
      markersRef.current.forEach(m=>m.remove()); markersRef.current=[];
      camps.forEach(camp=>{
        if(!camp.lat||!camp.lng) return;
        const ts=TYPE_STYLE[camp.type]||{dot:BLUE};
        const icon=window.L.divIcon({html:`<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:${ts.dot};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);transform:rotate(-45deg)"></div>`,iconSize:[30,30],iconAnchor:[15,30],className:""});
        const m=window.L.marker([camp.lat,camp.lng],{icon}).addTo(map)
          .bindPopup(`<div style="font-family:'DM Sans',sans-serif;min-width:180px"><b style="color:#2D1A08">${camp.name}</b><br/><span style="font-size:11px">${camp.type} · Ages ${camp.ages}</span><br/><span style="font-size:11px">💰 ${camp.cost||"—"} · 📅 ${camp.dates||"—"}</span><br/><br/><button onclick="window._cs(${camp.id})" style="width:100%;padding:6px;background:${BLUE};color:white;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">View Details →</button></div>`,{maxWidth:220});
        markersRef.current.push(m);
      });
      window._cs=id=>onSelect(id);
    };
    if(!window.L){
      const css=document.createElement("link"); css.rel="stylesheet"; css.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
      const js=document.createElement("script"); js.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; js.onload=init; document.head.appendChild(js);
    } else init();
    return()=>{delete window._cs;};
  },[camps]);
  return (
    <div style={{borderRadius:16,overflow:"hidden",border:`2px solid #E8D5A0`}}>
      <div ref={ref} style={{height:500,width:"100%",background:SKY}}/>
      <div style={{padding:"10px 14px",background:"white",borderTop:`1px solid #E8D5A0`,display:"flex",gap:12,flexWrap:"wrap"}}>
        {Object.entries(TYPE_STYLE).map(([t,{dot}])=>(
          <span key={t} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:dot,display:"inline-block"}}/>{t}
          </span>
        ))}
      </div>
    </div>
  );
};

const CampCard = ({camp,highlighted,saved,comparing,onAddReview,onToggleSave,onShowAlert,onToggleCompare}) => {
  const [expanded,setExpanded]=useState(highlighted);
  const [showReview,setShowReview]=useState(false);
  const [copied,setCopied]=useState(false);
  const [reviews,setReviews]=useState(camp.reviews||[]);
  const cardRef=useRef(null);
  const rating=avg(reviews);
  const ts=TYPE_STYLE[camp.type]||{bg:"#EFF8FF",fg:"#1A6FA8",dot:BLUE};
  useEffect(()=>{if(highlighted&&cardRef.current)cardRef.current.scrollIntoView({behavior:"smooth",block:"center"});},[highlighted]);
  const addReview=r=>{setReviews(p=>[...p,r]); onAddReview(camp.id,r);};
  const sharecamp=()=>{
    const url=getCampUrl(camp.id);
    if(navigator.share){
      navigator.share({title:camp.name,text:"Check out "+camp.name+" on Campful!",url});
    } else {
      navigator.clipboard.writeText(url)
        .then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);})
        .catch(()=>{prompt("Copy this link:",url);});
    }
  };
  return (
    <>
      <div ref={cardRef} style={{background:"white",borderRadius:18,border:`2px solid ${highlighted?BLUE:"#E8D5A0"}`,overflow:"hidden",transition:"all 0.2s",boxShadow:highlighted?`0 0 0 4px ${BLUE}22`:"0 2px 8px rgba(146,64,14,0.07)"}}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 8px 24px rgba(146,64,14,0.12)`;e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow=highlighted?`0 0 0 4px ${BLUE}22`:"0 2px 8px rgba(146,64,14,0.07)";e.currentTarget.style.transform="none";}}>
        <div style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:ts.bg,color:ts.fg,fontFamily:"'DM Sans',sans-serif"}}>{camp.type}</span>
                {camp.featured&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#FFF3CD",color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>⭐ Popular</span>}
                {camp.extCare&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:BLUE_LIGHT,color:BLUE_DARK,fontFamily:"'DM Sans',sans-serif"}}>🕐 Ext. Care</span>}
                {camp.springBreak&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"#E0F2FE",color:"#0369A1",fontFamily:"'DM Sans',sans-serif"}}>🌸 Spring Break</span>}
                {camp.singleDay&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"#F0FDF4",color:"#15803D",fontFamily:"'DM Sans',sans-serif"}}>📅 Single Day</span>}
              </div>
              <h3 style={{margin:0,fontSize:17,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08",lineHeight:1.25}}>{camp.name}</h3>
              {camp.org&&<p style={{margin:"3px 0 0",fontSize:12,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>{camp.org}</p>}
            </div>
            {rating&&<div style={{textAlign:"right",marginLeft:12,flexShrink:0}}>
              <div style={{fontSize:24,fontWeight:900,color:"#F59E0B",fontFamily:"'Fraunces',serif",lineHeight:1}}>{rating}</div>
              <div style={{fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>{reviews.length} review{reviews.length!==1?"s":""}</div>
            </div>}
          </div>
          <p style={{margin:"0 0 14px",fontSize:13,color:"#4A3520",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{camp.desc}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {[["👶",`Ages ${camp.ages||"?"}`],["💰",camp.cost||"See website"],["📅",camp.dates||"—"],["📍",camp.address]].map(([icon,txt])=>(
              <div key={icon} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#92600A",fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{flexShrink:0,fontSize:14}}>{icon}</span>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{txt}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            <button onClick={()=>setExpanded(!expanded)} style={{...S.btn(false),flex:1,minWidth:80,padding:"9px 0",borderRadius:10,fontSize:12}}>
              {expanded?"Hide ▲":"Details ▼"}
            </button>
            <button onClick={()=>setShowReview(true)} style={{...S.btn(true),flex:2,minWidth:110,padding:"9px 0",borderRadius:10,fontSize:12}}>
              ⭐ Review
            </button>
            <button onClick={()=>onShowAlert(camp)} style={{...S.btn(false),padding:"9px 10px",borderRadius:10,fontSize:13,flexShrink:0}} title="Registration alert">🔔</button>
            <button onClick={()=>onToggleSave(camp)} style={{padding:"9px 10px",borderRadius:10,border:`1.5px solid #E8D5A0`,fontSize:14,cursor:"pointer",background:saved?BLUE_LIGHT:"white",flexShrink:0,transition:"all 0.15s"}} title={saved?"Remove from schedule":"Save to schedule"}>
              {saved?"🔖":"🏷️"}
            </button>
            <button onClick={()=>onToggleCompare(camp)} style={{padding:"9px 10px",borderRadius:10,border:`1.5px solid #E8D5A0`,fontSize:13,cursor:"pointer",background:comparing?BLUE_LIGHT:"white",flexShrink:0,transition:"all 0.15s",fontWeight:700,color:comparing?BLUE_DARK:"#92600A"}} title={comparing?"Remove from compare":"Compare this camp"}>
              ⚖️
            </button>
            <button onClick={sharecamp} style={{...S.btn(false),padding:"9px 10px",borderRadius:10,fontSize:13,flexShrink:0}}>
              {copied?"✓":"📤"}
            </button>
          </div>
          {saved&&<p style={{margin:"8px 0 0",fontSize:11,color:BLUE,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>🔖 Saved to your schedule</p>}
        </div>
        {expanded&&(
          <div style={{borderTop:`1.5px solid #E8D5A0`,padding:20,background:SKY}}>
            <div style={{fontSize:13,color:"#4A3520",fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
              {camp.schedule&&<p style={{margin:0}}><strong style={{color:"#2D1A08"}}>Schedule:</strong> {camp.schedule}</p>}
              {camp.web&&<p style={{margin:0}}><strong style={{color:"#2D1A08"}}>Website:</strong> <a href={camp.web} target="_blank" rel="noopener noreferrer" style={{color:BLUE,textDecoration:"none",fontWeight:600}}>{camp.web}</a></p>}
              {camp.phone&&<p style={{margin:0}}><strong style={{color:"#2D1A08"}}>Phone:</strong> {camp.phone}</p>}
              {camp.extras&&<p style={{margin:0}}><strong style={{color:"#2D1A08"}}>Extras:</strong> {camp.extras}</p>}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <button onClick={()=>exportToICal(camp)} style={{...S.btn(false),fontSize:12,padding:"8px 14px",borderRadius:10}}>📅 Export to Calendar</button>
              <button onClick={()=>onShowAlert(camp)} style={{...S.btn(camp.registrationOpen,"#059669"),fontSize:12,padding:"8px 14px",borderRadius:10}}>
                {camp.registrationOpen?"🟢 Register Now":"🔔 Alert Me When Open"}
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <h4 style={{margin:0,fontSize:15,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Parent Reviews</h4>
              <button onClick={()=>setShowReview(true)} style={{...S.btn(true),fontSize:11,padding:"5px 12px",borderRadius:8}}>+ Add Yours</button>
            </div>
            {reviews.length>0?(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {reviews.map((r,i)=>(
                  <div key={i} style={{background:"white",borderRadius:12,padding:14,border:`1.5px solid #E8D5A0`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#2D1A08"}}>{r.name}</span>
                      <span style={{fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>{r.date||r.year}</span>
                    </div>
                    <Stars rating={r.rating} size={15}/>
                    <p style={{margin:"7px 0 0",fontSize:13,color:"#4A3520",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{r.text}</p>
                    {r.childAge&&<p style={{margin:"5px 0 0",fontSize:11,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>Child age: {r.childAge}</p>}
                  </div>
                ))}
              </div>
            ):(
              <div style={{textAlign:"center",padding:16,background:"white",borderRadius:12,border:`1.5px dashed #D4B896`}}>
                <p style={{margin:0,fontSize:13,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>No reviews yet — be the first! 🌵</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showReview&&<ReviewModal camp={camp} onClose={()=>setShowReview(false)} onSubmit={addReview}/>}
    </>
  );
};

const CompareModal = ({camps,allCamps,onToggle,onClose}) => {
  const ROWS = [
    ["Type",        c=>c.type],
    ["Ages",        c=>c.ages?`Ages ${c.ages}`:"—"],
    ["Cost",        c=>c.cost||"See website"],
    ["Schedule",    c=>c.schedule||"—"],
    ["Dates",       c=>c.dates||"—"],
    ["Location",    c=>c.address||"—"],
    ["Ext. Care",   c=>c.extCare?"✅ Yes":"❌ No"],
    ["Before Care", c=>c.beforeCare?"✅ Yes":"❌ No"],
    ["After Care",  c=>c.afterCare?"✅ Yes":"❌ No"],
    ["Spring Break",c=>c.springBreak?"✅ Yes":"❌ No"],
    ["Single Day",  c=>c.singleDay?"✅ Yes":"❌ No"],
    ["Rating",      c=>{const r=c.reviews?.length?(c.reviews.reduce((s,x)=>s+x.rating,0)/c.reviews.length).toFixed(1):null; return r?`⭐ ${r} (${c.reviews.length} reviews)`:"No reviews yet";}],
    ["Website",     c=>c.web?<a href={c.web} target="_blank" rel="noopener noreferrer" style={{color:BLUE,fontWeight:600,fontSize:12}}>Visit →</a>:"—"],
  ];
  const [search,setSearch]=useState("");
  const suggestions=allCamps.filter(c=>!camps.find(x=>x.id===c.id)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.type.toLowerCase().includes(search.toLowerCase()))).slice(0,5);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(92,40,8,0.65)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:860,boxShadow:"0 30px 80px rgba(92,40,8,0.25)",margin:"auto",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,#92400E,#F59E0B)`,padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{margin:0,fontSize:22,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white"}}>Compare Camps</h2>
            <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif"}}>Up to 3 camps side by side</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>✕ Close</button>
        </div>
        <div style={{padding:20}}>
          {camps.length<3&&(
            <div style={{marginBottom:16,position:"relative"}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>ADD A CAMP TO COMPARE</label>
              <input style={{...S.input,maxWidth:360}} placeholder="Search by name or type…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search&&suggestions.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,maxWidth:360,background:"white",border:`1.5px solid #E8D5A0`,borderRadius:10,boxShadow:"0 8px 20px rgba(146,64,14,0.12)",zIndex:10,marginTop:4}}>
                  {suggestions.map(c=>(
                    <button key={c.id} onClick={()=>{onToggle(c);setSearch("");}} style={{display:"block",width:"100%",padding:"10px 14px",border:"none",background:"transparent",textAlign:"left",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",borderBottom:`1px solid #F5EFE0`}}>
                      <span style={{fontWeight:700,fontSize:13,color:"#2D1A08"}}>{c.name}</span>
                      <span style={{fontSize:11,color:"#92600A",marginLeft:8}}>{c.type} · {c.cost}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {camps.length===0?(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:40,marginBottom:10}}>🌵</div>
              <p style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:"#2D1A08",margin:"0 0 6px"}}>No camps selected yet</p>
              <p style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",margin:0,color:"#92600A"}}>Use the search above or hit ⚖️ on any camp card</p>
            </div>
          ):(
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
                <thead>
                  <tr>
                    <th style={{width:110,padding:"8px 10px",textAlign:"left",fontSize:11,fontWeight:700,color:"#92600A",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.05em",borderBottom:`2px solid #E8D5A0`}}></th>
                    {camps.map(c=>{
                      const ts=TYPE_STYLE[c.type]||{};
                      return (
                        <th key={c.id} style={{padding:"8px 10px",textAlign:"left",borderBottom:`2px solid #E8D5A0`,minWidth:180}}>
                          <div style={{fontSize:13,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08",marginBottom:3}}>{c.name}</div>
                          <div style={{display:"flex",gap:5,alignItems:"center"}}>
                            <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:ts.bg,color:ts.fg,fontFamily:"'DM Sans',sans-serif"}}>{c.type}</span>
                            <button onClick={()=>onToggle(c)} style={{fontSize:10,padding:"2px 8px",borderRadius:10,border:"none",background:"#FFE4E6",color:"#9F1239",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>Remove</button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label,fn],i)=>(
                    <tr key={label} style={{background:i%2===0?"#FFFBF0":"white"}}>
                      <td style={{padding:"9px 10px",fontSize:11,fontWeight:700,color:"#92600A",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",verticalAlign:"top"}}>{label}</td>
                      {camps.map(c=>(
                        <td key={c.id} style={{padding:"9px 10px",fontSize:13,color:"#2D1A08",fontFamily:"'DM Sans',sans-serif",verticalAlign:"top",borderLeft:`1px solid #F5EFE0`}}>{fn(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AboutModal = ({onClose}) => {
  const faqs = [
    ["Is Campful free to use?","Yes, completely free! Campful is a community tool built by Phoenix parents, for Phoenix parents. No ads, no paywalls."],
    ["How do I find camps near me?","Use the ZIP CODE filter in the search bar — type your zip, hit Go, then pick a radius (5, 10, 15, or 25 miles). The map view also shows exactly where each camp is located."],
    ["How do I save camps to compare?","Hit the 🏷️ bookmark icon on any camp card to save it to your schedule. Then click ⚖️ to add it to the compare view."],
    ["Can I add a camp that's missing?","Absolutely! Hit the '+ Add a Camp' button in the header. Your submission goes straight into the list for the community."],
    ["How does the AI search work?","The ✨ AI search bar uses real-time web search to find Phoenix camps matching your description — try things like 'outdoor camp with extended care under $200' or 'STEM for a curious 9 year old'."],
    ["How do I export camps to my calendar?","Open any camp's Details and click '📅 Export to Calendar'. It downloads an .ics file that works with Google Calendar, Apple Calendar, and Outlook."],
    ["Are the reviews from real parents?","Yes! Reviews are submitted by Campful users. We don't verify them but they're from real families in the Phoenix area."],
    ["How do I get registration alerts?","Click the 🔔 bell icon on any camp card. If registration is open, it'll link you straight to the camp website. If not, it helps you send the camp an email asking to be notified."],
    ["Who built Campful?","Campful was built by an Arizona parent who was tired of spending hours Googling summer camps. It's a labor of love for the Phoenix parent community. 🌵"],
    ["How can I help improve it?","Use the '+ Add a Camp' button to add missing camps, leave reviews for camps your kids have attended, and spread the word to other Phoenix parents!"],
  ];
  const [open,setOpen]=useState(null);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(92,40,8,0.65)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:620,boxShadow:"0 30px 80px rgba(92,40,8,0.25)",margin:"auto",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,#92400E,#F59E0B)`,padding:"24px 28px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div>
              <h2 style={{margin:"0 0 6px",fontSize:28,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white"}}>About Campful 🌵</h2>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.85)",fontFamily:"'DM Sans',sans-serif",maxWidth:400,lineHeight:1.6}}>
                A free community tool built by Phoenix parents to make finding the perfect summer camp actually easy.
              </p>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",flexShrink:0,marginLeft:12}}>✕ Close</button>
          </div>
          <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
            {[["🏕️","55+ Camps listed"],["🌵","Phoenix & surrounds"],["💛","100% free, always"]].map(([e,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"7px 14px",display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:16}}>{e}</span>
                <span style={{fontSize:12,fontWeight:700,color:"white",fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:24}}>
          <h3 style={{margin:"0 0 14px",fontSize:17,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1A08"}}>Frequently Asked Questions</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {faqs.map(([q,a],i)=>(
              <div key={i} style={{borderRadius:12,border:`1.5px solid ${open===i?"#E8D5A0":"#F0E8D8"}`,overflow:"hidden",transition:"all 0.15s"}}>
                <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"13px 16px",border:"none",background:open===i?"#FFFBF0":"white",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <span style={{fontSize:13,fontWeight:700,color:"#2D1A08",fontFamily:"'DM Sans',sans-serif",lineHeight:1.4}}>{q}</span>
                  <span style={{fontSize:14,color:"#D97706",flexShrink:0,transition:"transform 0.15s",transform:open===i?"rotate(180deg)":"none"}}>▼</span>
                </button>
                {open===i&&(
                  <div style={{padding:"0 16px 14px",fontSize:13,color:"#4A3520",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,background:"#FFFBF0"}}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:16,background:"#FEF3C7",borderRadius:12,border:`1.5px solid #FDE68A`,textAlign:"center"}}>
            <p style={{margin:"0 0 4px",fontSize:14,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#92400E"}}>Know a camp that's missing?</p>
            <p style={{margin:0,fontSize:12,color:"#A07040",fontFamily:"'DM Sans',sans-serif"}}>Hit the + Add a Camp button and help the Phoenix parent community! 🌵</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({onClose}) => {
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const send=()=>{
    if(!msg.trim()) return;
    window.open("mailto:hello@campfulphx.com?subject=Campful Feedback&body="+encodeURIComponent(msg));
    setSent(true);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(92,40,8,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:480,boxShadow:"0 30px 80px rgba(92,40,8,0.25)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#92400E,#F59E0B)",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{margin:0,fontSize:20,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white"}}>Share Feedback</h2>
            <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif"}}>Help us make Campful better for Phoenix parents</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:10,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>✕ Close</button>
        </div>
        <div style={{padding:24}}>
          {sent?(
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{fontSize:40,marginBottom:12}}>💛</div>
              <p style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:900,color:"#2D1A08",margin:"0 0 8px"}}>Thank you!</p>
              <p style={{fontSize:13,color:"#92600A",fontFamily:"'DM Sans',sans-serif",margin:"0 0 20px"}}>Your feedback helps the whole Phoenix parent community.</p>
              <button onClick={onClose} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#D97706",color:"white",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Close</button>
            </div>
          ):(
            <>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                {["Missing a camp I know about","A camp listing has wrong info","Suggestion for a new feature","General feedback"].map(s=>(
                  <button key={s} onClick={()=>setMsg(s+": ")} style={{padding:"9px 14px",borderRadius:10,border:"1.5px solid #E8D5A0",background:msg.startsWith(s)?"#FEF3C7":"white",textAlign:"left",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#2D1A08"}}>
                    {s}
                  </button>
                ))}
              </div>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type your feedback here..." style={{width:"100%",minHeight:100,padding:"10px 12px",borderRadius:10,border:"1.5px solid #E8D5A0",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
              <button onClick={send} disabled={!msg.trim()} style={{marginTop:12,width:"100%",padding:"12px",borderRadius:10,border:"none",background:msg.trim()?"#D97706":"#E8D5A0",color:"white",fontWeight:700,fontSize:14,cursor:msg.trim()?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>
                Send Feedback →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Campful() {
  const [camps,setCamps]=useState(CAMPS);
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("All");
  const [ageFilter,setAgeFilter]=useState("All Ages");
  const [costFilter,setCostFilter]=useState("Any Cost");
  const [timeFilter,setTimeFilter]=useState("Any Schedule");
  const [sortBy,setSortBy]=useState("featured");
  const [view,setView]=useState("list");
  const [aiQuery,setAiQuery]=useState("");
  const [isSearching,setIsSearching]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [showSchedule,setShowSchedule]=useState(false);
  const [showCompare,setShowCompare]=useState(false);
  const [showAbout,setShowAbout]=useState(false);
  const [showFeedback,setShowFeedback]=useState(false);
  const [compareIds,setCompareIds]=useState(new Set());
  const [alertCamp,setAlertCamp]=useState(null);
  const [savedIds,setSavedIds]=useState(new Set());
  const [highlighted,setHighlighted]=useState(getHighlightedId());
  const [zipCode,setZipCode]=useState("");
  const [radius,setRadius]=useState("10");
  const [zipCoords,setZipCoords]=useState(null);
  const [zipLoading,setZipLoading]=useState(false);

  const filtered=camps.filter(c=>{
    const q=search.toLowerCase();
    return (!q||[c.name,c.desc,c.type,c.address,c.org].some(s=>(s||"").toLowerCase().includes(q)))
      &&(typeFilter==="All"||c.type===typeFilter)
      &&ageMatch(c.ages,ageFilter)&&parseCost(c.cost,costFilter)&&timeMatch(c,timeFilter)
      &&(!zipCoords||!c.lat||distMiles(zipCoords.lat,zipCoords.lng,c.lat,c.lng)<=parseFloat(radius));
  }).sort((a,b)=>{
    if(sortBy==="featured") return (b.featured?1:0)-(a.featured?1:0);
    if(sortBy==="rating"){const r=x=>x.reviews.length?x.reviews.reduce((s,rv)=>s+rv.rating,0)/x.reviews.length:0;return r(b)-r(a);}
    if(sortBy==="cost") return (a.costNum||0)-(b.costNum||0);
    return a.name.localeCompare(b.name);
  });

  const savedCamps=camps.filter(c=>savedIds.has(c.id));
  const toggleSave=camp=>setSavedIds(prev=>{const n=new Set(prev);n.has(camp.id)?n.delete(camp.id):n.add(camp.id);return n;});
  const toggleCompare=camp=>setCompareIds(prev=>{const n=new Set(prev);if(n.has(camp.id)){n.delete(camp.id);}else if(n.size<3){n.add(camp.id);}else{alert("You can compare up to 3 camps at a time.");}return n;});
  const compareCamps=camps.filter(c=>compareIds.has(c.id));

  const lookupZip=async()=>{
    if(!zipCode.trim()||zipCode.length<5){alert("Please enter a valid 5-digit zip code.");return;}
    setZipLoading(true);
    try {
      const res=await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&format=json&limit=1`);
      const data=await res.json();
      if(data.length>0) setZipCoords({lat:parseFloat(data[0].lat),lng:parseFloat(data[0].lon)});
      else alert("Zip code not found. Please try another.");
    } catch(e){alert("Could not look up zip code. Please try again.");}
    setZipLoading(false);
  };

  const handleAISearch=async()=>{
    if(!aiQuery.trim()) return;
    setIsSearching(true);
    try {
      const res=await fetch("/.netlify/functions/search",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({query:aiQuery})
      });
      if(!res.ok) throw new Error(await res.text());
      const parsed=await res.json();
    } catch(e){console.error('AI search error:',e); alert('AI search error: '+e.message);}
    setIsSearching(false);
  };

  const handleAddReview=(id,r)=>setCamps(prev=>prev.map(c=>c.id===id?{...c,reviews:[...c.reviews,r]}:c));

  return (
    <div style={{minHeight:"100vh",background:SKY,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:`linear-gradient(160deg,#92400E 0%,#D97706 55%,#F59E0B 100%)`,padding:"28px 16px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"absolute",top:20,right:80,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
        <div style={{position:"absolute",bottom:-80,left:40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
        <div style={{maxWidth:980,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{margin:0,fontSize:52,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white",letterSpacing:"-2px",lineHeight:1}}>Campful</h1>
              <p style={{margin:"4px 0 0",fontSize:13,color:"rgba(255,255,255,0.75)",fontFamily:"'DM Sans',sans-serif"}}>
                📍 Phoenix & Scottsdale · Summer camps, sorted. By parents, for parents. 🌵
              </p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px"}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.9)",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{camps.length} camps</span>
              </div>
              <button onClick={()=>setShowAbout(true)} style={{padding:"9px 16px",borderRadius:11,border:"2px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                About & FAQ
              </button>
              <button onClick={()=>setShowFeedback(true)} style={{padding:"9px 16px",borderRadius:11,border:"2px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                💛 Feedback
              </button>
              {compareIds.size>0&&(
                <button onClick={()=>setShowCompare(true)} style={{padding:"9px 16px",borderRadius:11,border:"none",background:"white",color:BLUE_DARK,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  ⚖️ Compare ({compareIds.size})
                </button>
              )}
              <button onClick={()=>setShowSchedule(true)} style={{padding:"9px 16px",borderRadius:11,border:"2px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                📅 Schedule{savedIds.size>0?` (${savedIds.size})`:""}
              </button>
              <button onClick={()=>setShowAdd(true)} style={{padding:"9px 16px",borderRadius:11,border:"none",background:"white",color:BLUE,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                + Add a Camp
              </button>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:"14px 14px 0 0",padding:"14px 14px 18px",backdropFilter:"blur(10px)"}}>
            <p style={{margin:"0 0 8px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",letterSpacing:"0.08em",fontFamily:"'DM Sans',sans-serif"}}>✨ AI CAMP FINDER — searches the web in real time</p>
            <div style={{display:"flex",gap:8}}>
              <input style={{flex:1,border:"none",borderRadius:10,padding:"12px 16px",fontSize:13,outline:"none",background:"white",fontFamily:"'DM Sans',sans-serif",color:"#2D1A08",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}
                placeholder='e.g. "outdoor camp with extended care under $200" or "STEM for a 10 year old"'
                value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAISearch()}/>
              <button onClick={handleAISearch} disabled={isSearching} style={{padding:"12px 20px",background:BLUE_DARK,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",opacity:isSearching?0.7:1,fontFamily:"'DM Sans',sans-serif",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                {isSearching?"Searching…":"Search 🔍"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"16px"}}>
        <div style={{overflowX:"auto",marginBottom:14,paddingBottom:4}}>
          <div style={{display:"flex",gap:8}}>
            {TYPES.map(t=>(
              <button key={t} onClick={()=>setTypeFilter(t)} style={S.pill(typeFilter===t,TYPE_STYLE[t])}>
                {t==="All"?"🌵 All Camps":t}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:"white",borderRadius:14,padding:14,marginBottom:14,border:`1.5px solid #E8D5A0`,boxShadow:"0 2px 8px rgba(146,64,14,0.06)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:12}}>
            {[["SEARCH","text",search,setSearch,"Search camps…"],["CHILD'S AGE","select",ageFilter,setAgeFilter,AGES],["WEEKLY COST","select",costFilter,setCostFilter,COSTS],["SCHEDULE / CARE","select",timeFilter,setTimeFilter,TIMES]].map(([lbl,type,val,set,opts])=>(
              <div key={lbl}>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>{lbl}</label>
                {type==="text"
                  ?<input style={S.input} placeholder={opts} value={val} onChange={e=>set(e.target.value)}/>
                  :<select style={S.input} value={val} onChange={e=>set(e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>}
              </div>
            ))}
            <div>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"#92600A",marginBottom:5,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>ZIP CODE</label>
              <div style={{display:"flex",gap:5}}>
                <input style={{...S.input,flex:1}} placeholder="e.g. 85016" maxLength={5} value={zipCode}
                  onChange={e=>setZipCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookupZip()}/>
                <button onClick={zipCoords?()=>{setZipCoords(null);setZipCode("");}:lookupZip}
                  style={{padding:"9px 10px",borderRadius:8,border:`1.5px solid #E8D5A0`,background:zipCoords?"#FFE4E6":"white",color:zipCoords?"#9F1239":BLUE,fontSize:12,cursor:"pointer",fontWeight:700,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
                  {zipLoading?"…":zipCoords?"✕":"Go"}
                </button>
              </div>
              {zipCoords&&(
                <>
                  <div style={{display:"flex",gap:5,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontSize:10,color:"#92600A",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>WITHIN</span>
                    {["5","10","15","25"].map(r=>(
                      <button key={r} onClick={()=>setRadius(r)} style={{fontSize:10,padding:"3px 8px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,background:radius===r?BLUE:BLUE_LIGHT,color:radius===r?"white":BLUE}}>
                        {r}mi
                      </button>
                    ))}
                  </div>
                  <p style={{margin:"4px 0 0",fontSize:10,color:BLUE,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>📍 Showing camps within {radius} miles of {zipCode}</p>
                </>
              )}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:10,fontWeight:700,color:"#92600A",letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>SORT:</span>
              {["featured","rating","cost","name"].map(s=>(
                <button key={s} onClick={()=>setSortBy(s)} style={S.btn(sortBy===s)}>
                  {s[0].toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,color:"#A07040",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{filtered.length} camp{filtered.length!==1?"s":""}</span>
              <div style={{display:"flex",border:`1.5px solid #E8D5A0`,borderRadius:10,overflow:"hidden"}}>
                {[["list","≡ List"],["map","🗺 Map"]].map(([v,label])=>(
                  <button key={v} onClick={()=>setView(v)} style={{padding:"7px 14px",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:view===v?BLUE:"white",color:view===v?"white":"#92600A",transition:"all 0.15s"}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {view==="map"?(
          <MapView camps={filtered} onSelect={id=>{setView("list");setHighlighted(id);}}/>
        ):filtered.length>0?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
            {filtered.map(c=>(
              <CampCard key={c.id} camp={c} highlighted={highlighted===c.id} saved={savedIds.has(c.id)} comparing={compareIds.has(c.id)} onAddReview={handleAddReview} onToggleSave={toggleSave} onShowAlert={setAlertCamp} onToggleCompare={toggleCompare}/>
            ))}
          </div>
        ):(
          <div style={{textAlign:"center",padding:"60px 0",color:"#A07040"}}>
            <div style={{fontSize:52,marginBottom:12}}>🌵</div>
            <p style={{fontSize:18,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1A08",margin:"0 0 6px"}}>No camps found</p>
            <p style={{fontSize:13,margin:"0 0 18px",fontFamily:"'DM Sans',sans-serif"}}>Try adjusting your filters or use AI Search above</p>
            <button onClick={()=>setShowAdd(true)} style={{...S.btn(true),padding:"11px 22px",borderRadius:12,fontSize:13}}>+ Add a Camp</button>
          </div>
        )}

        <div style={{textAlign:"center",padding:"28px 0 10px",fontSize:12,color:"#D4B896",fontFamily:"'DM Sans',sans-serif"}}>
          🌵 Campful · Phoenix & Scottsdale Area Summer Camps · By parents, for parents.
        </div>
      </div>

      {showSchedule&&<ScheduleBuilder savedCamps={savedCamps} onToggleSave={toggleSave} onClose={()=>setShowSchedule(false)}/>}
      {showAdd&&<AddCampModal onClose={()=>setShowAdd(false)} onAdd={c=>setCamps(prev=>[c,...prev])}/>}
      {alertCamp&&<AlertModal camp={alertCamp} onClose={()=>setAlertCamp(null)}/>}
      {showCompare&&<CompareModal camps={compareCamps} allCamps={camps} onToggle={toggleCompare} onClose={()=>setShowCompare(false)}/>}
      {showAbout&&<AboutModal onClose={()=>setShowAbout(false)}/>}
      {showFeedback&&<FeedbackModal onClose={()=>setShowFeedback(false)}/>}
    </div>
  );
}
