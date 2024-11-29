
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from './user-role.schema';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, unique: true, validate: /\S+@\S+\.\S+/ })
    email: string;

    @Prop({ required: true, minlength: 8 })
    password: string;

    @Prop({ required: true, minlength: 1 })
    firstName: string;

    @Prop({ required: true, minLength: 1 })
    lastName: string;

    @Prop()
    role: UserRole;
    
    @Prop({ default: null })
    refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.refreshToken;
    }
});
