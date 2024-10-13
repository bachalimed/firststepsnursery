export const DataArray = [
    {
        Id: "01",
        Subject: "Sciences",
        Site: "School",
        StartTime: new Date(2024,9,12,10,20),
        EndTime: new Date(2024,9,12,11,20),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=8',
        isAllDay:false,
        Grade: "4",
        School: "HediChaker",
        Student:["ali ben hami", "sirine Bechir"]
    },
    {
        Id: "02",
        Subject: "Sport",
        Site: "School",
        StartTime: new Date(2024,9,12,10,20),
        EndTime: new Date(2024,9,12,11,20),
        isAllDay:false,
        Grade: "3",
        School: "Nebhani",
        Student:["bechir hamadi", "fatiha sariti"]
    },
    {
        Id: "022",
        Subject: "Sport",
        Site: "School",
        StartTime: new Date(2024,9,24,9,20),
        EndTime: new Date(2024,9,24,10,20),
        isAllDay:false,
        RecurrenceID:"02",
        Grade: "3",
        School: "Nebhani",
        Student:["bechir hamadi", "fatiha sariti"]
    },
    {
        Id: "03",
        Subject: "Study",
        Site: "Nursery",
        StartTime: new Date(2024,9,12,10,30),
        EndTime: new Date(2024,9,12,13,20),
        isAllDay:false,
        Grade: "4",
        Animator: "Mahdi",
        Student:["sami chamadi", "samiya sartiiti"]
    },
    {
        Id: "04",
        Subject: "Study",
        Site: "Nursery",
        StartTime: new Date(2024,10,11,10,30),
        EndTime: new Date(2024,10,11,13,20),
        isAllDay:false,
        Grade: "4",
        Animator: "Mahdi",
        Student:["sami chamadi", "samiya sartiiti"]
    },
];