
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '.';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, validate: /\S+@\S+\.\S+/ })
    email: string;

    @Prop({ required: true, minlength: 8 })
    password: string;

    @Prop({ minlength: 1 })
    firstName: string;

    @Prop({ minLength: 1 })
    lastName: string;

    @Prop({ default: 'user' })
    role: UserRole;

    @Prop({ default: null })
    refreshToken: string | null;

    @Prop({ default: null })
    img: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret._id) {
            ret.id = ret._id;
        }
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.refreshToken;
    }
});
