const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});

  res.json(listings);
};

module.exports.showListing = async (req,res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  res.json(listing);
};

// module.exports.createListing = async (
//   req,
//   res
// ) => {
//   let url = "";
//   let filename = "";

//   if (req.file) {
//     url = req.file.path;
//     filename = req.file.filename;
//   }

//   const newListing = new Listing(
//     req.body.listing
//   );

//   newListing.owner = req.user._id;

//   newListing.image = {
//     url,
//     filename,
//   };

//   await newListing.save();

//   res.status(201).json({
//     success: true,
//     listing: newListing,
//   });
// };

module.exports.createListing = async (req, res) => {
  try {
    // Ensure user authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    let url = "";
    let filename = "";

    // handle file upload
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }

    // Create listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url,
      filename,
    };

    await newListing.save();
    res.status(201).json({
      success: true,
      listing: newListing,
    });
    
  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).json({ success: false, message: "Server error while creating listing" });
  }
};

// update listing

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { returnDocument: 'after' }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    listing: listing,
  });
};

// search listing

module.exports.searchListings = async (req, res) => {
  const q = req.query.q;

  if (!q || !q.trim()) {
    return res.json([]);
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ],
  });

  res.json(listings);
};


// user profile and there listings

module.exports.getUserListings = async (req, res) => {
    const { userId } = req.params; 
    const listings = await Listing.find({ owner: userId }); 
    res.json(listings);
};

// delete listing

module.exports.destroyListing = async (
  req,
  res
) => {
  const { id } = req.params;

  const deletedListing =
    await Listing.findByIdAndDelete(id);

  res.json({
    success: true,
    deletedListing,
  });
};
