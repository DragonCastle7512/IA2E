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

    async updateRefreshToken(memberId, refreshToken) {
        await this.Member.update(
            {
                refresh_token: refreshToken
            },
            {
                where: { id: memberId }
            }
        );
    }

    async findRefreshToken(memberId) {
        const refreshToken = await this.Member.findOne({
            where: { id: memberId },
            attributes: ['refresh_token'],
        })
        return refreshToken.toJSON();
        
    }
}
module.exports = MemberRepository;