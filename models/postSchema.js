const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: false,
        default: ""
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: [{
        specification_field_type: String,
        specification_name: String
    }],
    place: {
        type: String,
        required: false,
        default: "Yerevan"
    },
    constructionType: {
        type: String,
        required: false,
        default: "Panels"
    },
    newConstruction: {
        type: Boolean,
        required: false,
        default: false
    },
    elevator: {
        type: Boolean,
        required: false,
        default: false
    },
    floor: {
        type: String,
        required: true,
        default: ""
    },
    floorArea: {
        type: Number,
        required: true,
        default: 0
    },
    roomsCount: {
        type: Number,
        required: true,
        default: 0
    },
    bathroomsCount: {
        type: Number,
        required: true,
        default: 0
    },
    ceilingHeight: {
        type: Number,
        required: true,
        default: 0
    },
    balcony: {
        type: Number,
        required: false,
        default: 0
    },
    furniture: {
        type: Boolean,
        required: false,
        default: false
    },
    category: {
        type: String,
        required: true,
        ref: "Category"
    },
    renovation: {
        type: String,
        required: false,
        default: ""
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)