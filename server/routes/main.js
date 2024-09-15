const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "The AI That Writes Your Love Letters: How GPT-3 is Ruining Romance",
//       body: "Learn how GPT-3 is taking over the world of romance by writing love letters so good that even Shakespeare is jealous."
//     },
//     {
//       title: "Blockchain for Cats: Why Your Feline Friend Needs a Decentralized Identity",
//       body: "Discover the latest in blockchain technology and why your cat's identity should be secured on the blockchain. Because even cats need decentralized security."
//     },
//     {
//       title: "When Your Fridge is Smarter Than You: The Rise of IoT in Kitchen Appliances",
//       body: "Explore how IoT is revolutionizing your kitchen, turning your fridge into a food detective that knows more about your eating habits than you do."
//     },
//     {
//       title: "Quantum Computing Explained: Or How to Sound Smart at Parties",
//       body: "Understand the basics of quantum computing just enough to drop it casually at parties and impress everyone, even if you don't fully get it yourself."
//     },
//     {
//       title: "Virtual Reality for Dogs: How Fido Can Finally Chase That Virtual Squirrel",
//       body: "Learn how VR is not just for humans anymore. Dogs are getting in on the action, too, with virtual squirrels that keep them entertained for hours."
//     },
//     {
//       title: "The Smart Mirror That Roasts Your Outfit Choices: Fashion Advice You Didn’t Ask For",
//       body: "Discover the latest in smart home technology: a mirror that not only shows you your reflection but also critiques your fashion sense with brutal honesty."
//     },
//     {
//       title: "Self-Driving Cars: When Your Car Has a Better Social Life Than You",
//       body: "Explore the world of self-driving cars and how they're becoming so advanced that they might soon have their own social networks—leaving you in the dust."
//     },
//     {
//       title: "3D Printing: How to Lose Friends and Alienate People with Your New Hobby",
//       body: "Learn the ins and outs of 3D printing, and why your friends might start avoiding you once you keep gifting them oddly-shaped plastic trinkets."
//     },
//     {
//       title: "Smart Toilets: The Future of Bathroom Breaks",
//       body: "Delve into the world of smart toilets, which now offer features like mood lighting, music, and health tracking. Your bathroom will never be the same."
//     },
//     {
//       title: "When Your Smartwatch Knows You're Lazy: The Dark Side of Fitness Trackers",
//       body: "Understand how fitness trackers have evolved to the point where they don't just track your steps, they judge you for skipping the gym."
//     },
//   ])
// }

// insertPostData();



module.exports = router;