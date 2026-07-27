var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
export var AccoutType;
(function (AccoutType) {
    AccoutType["PUBLIC"] = "PUBLIC";
    AccoutType["PRIVATE"] = "PRIVATE";
})(AccoutType || (AccoutType = {}));
let User = class User {
    id;
    username;
    fulName;
    email;
    password;
    bio;
    website;
    profilePicture;
    accountType;
    professionalAccount;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({
        type: "varchar", length: 150, unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({
        type: "varchar", length: 150,
    }),
    __metadata("design:type", String)
], User.prototype, "fulName", void 0);
__decorate([
    Column({
        type: "varchar",
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: "text"
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "website", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    Column({
        type: "enum",
        enum: AccoutType,
        default: AccoutType.PUBLIC
    }),
    __metadata("design:type", String)
], User.prototype, "accountType", void 0);
__decorate([
    Column({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "professionalAccount", void 0);
User = __decorate([
    Entity("users")
], User);
export { User };
//# sourceMappingURL=userEntities.js.map