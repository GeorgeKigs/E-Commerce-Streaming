/* 
* Acts as a collection for schortcodes for that are sent 
* to the users as they try reset their passwords
*
*/
import {Schema,model, Date,Model} from "mongoose";

interface shortCodeInt{
    email:string,
    phoneNumber:number,
    code:string,
    createdAt:Date|any,
}

interface shortCodeMethodInt extends Model<shortCodeInt>{
    findByEmail(email:string):Promise<shortCodeInt|null>,
    findByPhoneNumber(phoneNumber:number):Promise<shortCodeInt|null>,
    verifyByEmail(email:string,code:string):Promise<boolean>,
    verifyByPhoneNumber(phoneNumber:number,code:string):Promise<boolean>,
}

const shortCodeSchema = new Schema<shortCodeInt,shortCodeMethodInt>({
    email: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: Number
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30m'
    }
}, {
    collection: "Short_Codes",
    timestamps: true
})

const {
    statics
} = shortCodeSchema;

shortCodeSchema.pre('save', function (next) {
 
    var details = db.findOneAndUpdate(
        {email:this.email},{code:this.code}
    )
    if (!details) {
        var details = db.findOneAndUpdate(
            {phoneNumber:this.phoneNumber},{code:this.code}
        )
        if (!details) {
            next()
        }
    }
    let err = new Error("Updated the code")
    next(err)
})

statics.findByEmail = async function (email:string):Promise<shortCodeInt|null> {
    var details = await db.findOne({
        email
    })
    return details;
}

statics.findByPhoneNumber = async function (phoneNumber:number) {
    let details = await db.findOne({
        phoneNumber:phoneNumber
    })
    return details;
}

statics.verifyByEmail = async function (email:string, code:string):Promise<boolean> {
    var details = await this.findByEmail(email)
    if (details) {
        if (details.code === code) {
            return true
        }
    }
    return false
}

statics.verifyByPhoneNumber = async function (phoneNumber:number, code:string):Promise<boolean> {
    var details = await this.findByPhoneNumber(phoneNumber)
    if (details) {
        if (details.code === code) {
            return true
        }
    }
    return false
}

var db = model<shortCodeInt,shortCodeMethodInt>('Short_Codes', shortCodeSchema)
export { db as shortCodeDb}app.use("/", indexRouter);
// app.use("/users", usersRouter);

// app.use("/products", productsRouter);
// app.use("/orders", ordersRouter);
// app.use("/cart", cartRouter);
// app.use("/categories", categoriesRouter);