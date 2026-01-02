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

    async createMember(member) {
        const memberResult = await this.Member.create({
            email: member.email,
            password: member.password
        });
        return memberResult.toJSON();
    }

    async update(member) {
        const memberResult = await this.Member.update(
            {
                password: member.password
            },
            {
                where: { email: member.email }
            }
        );
        return memberResult.toJSON();
    }
}
module.exports = MemberRepository;