//1.Design database for Zen class programme

//2.Insert to users data collection  

db.users.insertMany([
    {
        'userId': 1,
        'name': 'hari',
        'email': 'hari@gmail.com',
        'mobile': '123467890'
    },
    {
        'userId': 2,
        'name': 'raja',
        'email': 'raja@gmail.com',
        'mobile': '8458382938'
    },
    {
        'userId': 3,
        'name': 'praveen',
        'email': 'praveen@gmail.com',
        'mobile': '123467899'
    },
    {
        'userId': 4,
        'name': 'guna',
        'email': 'guna@gmail.com',
        'mobile': '123467898'
    },
    {
        'userId': 5,
        'name': 'dhanu',
        'email': 'dhanu@gmail.com',
        'mobile': '123467897'
    },
]);




//3.Insert to codekata collection
db.codekata.insertMany([
    {
        'userId': 1,
        'problemsSolved': 120,
        'rank': 3000,
        'geekcoins': 2500
    },
    {
        'userId': 2,
        'problemsSolved': 220,
        'rank': 2000,
        'geekcoins': 4500
    },
    {
        'userId': 3,
        'problemsSolved': 320,
        'rank': 1000,
        'geekcoins': 7500
    },
    {
        'userId': 4,
        'problemsSolved': 520,
        'rank': 400,
        'geekcoins': 11500
    },
    {
        'userId': 5,
        'problemsSolved': 720,
        'rank': 100,
        'geekcoins': 16500
    },
]);






//4.Insert to attendance collection
db.attendance.insertMany([
    {
        'userId': 1,
        'date': new Date("2020-10-15"),
        'status': 'absent'
    },
    {
        'userId': 2,
        'date': new Date("2020-10-15"),
        'status': 'present'
    },
    {
        'userId': 3,
        'date': new Date("2020-10-15"),
        'status': 'absent'
    },
    {
        'userId': 4,
        'date': new Date("2020-10-15"),
        'status': 'present'
    },
    {
        'userId': 5,
        'date': new Date("2020-10-15"),
        'status': 'absent'
    },
]);

//5.Insert to topics collection:


db.topics.insertMany([
    {
        'topic_Id': 1,
        'topic_name': 'Javascript-functions',
        'tasks': ["arrow-functions", "inline-functions", "IIFE"],
        'date': new Date("2020-10-15"),
    },
    {
        'topic_Id': 2,
        'topic_name': 'Javascript-variables',
        'tasks': ["var", "let"],
        'date': new Date("2020-10-15")
    },
    {
        'topic_Id': 3,
        'topic_name': 'Javascript-events',
        'tasks': ["event-bubbling", "event-listners"],
        'date': new Date("2020-10-15"),
    },
    {
        'topic_Id': 4,
        'topic_name': 'mysql-crud',
        'tasks': ["create-table", "update-table","insert"],
        'date': new Date("2020-10-15")
    },
    {
        'topic_Id': 5,
        'topic_name': 'mongo',
        'tasks': ["find", "aggregate"],
        'date': new Date("2020-10-15")
    },
]);

//6.Insert to drives collection


db.drives.insertMany([
    {
        'drive_id': 1,
        'drive_name': 'google',
        'user_ids': [1, 2, 3, 4],
        'date': new Date("2020-10-15")
    },
    {
        'drive_id': 2,
        'drive_name': 'hotstar',
        'user_ids': [3, 4],
        'date': new Date("2020-11-15")
    },
    {
        'drive_id': 3,
        'drive_name': 'microsoft',
        'user_ids': [1, 2, 3, 4],
        'date': new Date("2020-10-25")
    },
    {
        'drive_id': 4,
        'drive_name': 'amazon',
        'user_ids': [1, 2, 3],
        'date': new Date("2020-10-30")
    },
    {
        'drive_id': 5,
        'drive_name': 'redbus',
        'user_ids': [1,2,3,4],
        'date': new Date("2020-09-15")
    },
]);


// -------------------------------------------------------------------------------

//11.Find all the topics and tasks which are taught in the month of October

db.topics.aggregate([
    {
        $project: {
            'topic_name': 1,
            'date': '$date',
            'month': {
                '$month': '$date'
            },
            'year': {
                $year: '$date'
            },
        }
    },
    {
        $match: {
            'month': 10,
            'year': 2020
        }
    },
    {
        $project: {
            'topic_name': 1,
            'date': 1
        }
    }
]).pretty()

// 12. Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.drives.aggregate([
    {
       $project:{
           'drive_name': '$dirve_name',
           'date': 1,
           'day': { $dayOfMonth : '$date'},
           'month': {$month : '$date'},
           'year': {$year: '$date'}
       }
    },
    {
        $match: {
            'year':{
                $eq : 2020
            },
            'month':{
                $eq : 10
            },
            'day': {
                $gte: 15,
                $lte:31
            }
        }
    },
    {
        $project: {
            'drive_name': 1,
            'date': 1
        }
    }

]).pretty();

// 13) Find all the company drives and students who are appeared for the placement.

db.drives.aggregate([
    {
        $lookup: {
            from: 'users',
            localField: 'user_ids',
            foreignField: 'userdId',
            as: 'res'
        }
    }
]).pretty()

//14) Find the number of problems solved by the user in codekata


db.codekata.aggregate([
    {
        $lookup:{
            from: 'users',
            localField: 'userId',
            foreignField: 'userdId',
            as: 'user_details'
        }
    },
    {
        $project: { 
            'name' : '$user_details.name',
            'problems_solved': '$problemsSolved'
        }
    }
]).pretty()


// 15) Find all the mentors with who has the mentee's count more than 15


db.mentors.aggregate([
    {
        $lookup: {
            from: 'users',
            localField: 'mentor_id',
            foreignField: 'userdId',
            as: 'mentor_details'
        }
    },
    {
        $project: {
            'mentor_name': '$mentor_details.name',
            'mentees_count': {
                $size: '$mentee_ids'
            }
        }
    },
    {
        $match: {
            'mentees_count': {
                $gte: 15
            }
        }
    }
]).pretty()


// 16)Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020



db.attendance.aggregate([
    {
        $lookup:{
            from: 'tasks',
            localField: 'userId',
            foreignField: 'user_id',
            as: 'userTasks'
        }
    },
    {
        $match: {
            'userTasks.submission_date': {
                $gte: ISODate("2020-10-15T00:00:00Z"),
                $lte: ISODate("2020-11-01T00:00:00Z"),
            },
            'status': 'absent'
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userdId',
            as: 'userDetails'

        }
    },
    {
        $project: {
            'userDetails': {
                $arrayElemAt: ["$userDetails", 0]
            },
            'taskDetails': {
                $arrayElemAt: ["$userTasks", 0]
            },
            'status': 1
        }
    },
    {
        $project: {
            'Name': "$userDetails.name",
            'Task Name': '$taskDetails.task_name',
            'status': 1,
            'Submission date': '$taskDetails.submission_date',

        }
    }
]).pretty()