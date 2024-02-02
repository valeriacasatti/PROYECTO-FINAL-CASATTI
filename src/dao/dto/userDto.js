export class User {
  constructor(userInfo) {
    (this.fullName = `${userInfo.firstName} ${userInfo.lastName}`).toLocaleUpperCase(),
      (this.email = userInfo.email),
      (this.avatar = userInfo.avatar),
      (this.role = userInfo.role),
      (this.cart = userInfo.cart),
      (this._id = userInfo._id);
  }
}
