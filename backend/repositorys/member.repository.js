class MemberRepository {
    constructor(Member) {
        this.Member = Member;
    }

    async findByEmail(email) {
        const messages = await this.Member.findOne({
            where: {
                email: email
            }
        });
        return messages;
    }
}
module.exports = MemberRepository;