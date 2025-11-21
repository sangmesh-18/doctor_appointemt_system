import mongoose  from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"data:image/webp;base64,UklGRnAJAABXRUJQVlA4IGQJAACQRgCdASoEARgBPjEYikOiIaESeuTUIAMEtLdwufiBfIfJf6p/nPS/0M6Drzh7VfJJc/rL/eb7l+Y3yC7F94x/K/79v9IA/y7+a/2/8i/7N8Ys638JzL/yz+2/k7zx3h/sAfyD+cf2H8vP8T9S3+T/mPt1+Cf0v/lvcC/jX8m/wf90/cv+8////7fcr7GP2I9iT9Rvv/DvMzMzMzMzMzMzMoQauh/R9OyG06+VGQfWslGCjWqqqqnfCubPGZPXbT7uqZ5nmZmYWupdG7PtIT90oWAPoHDsnSAUadX7hLN4O/QpmVLG0OpDl6GcYXDGFEq6Y6dxtfQhxIm7XMjIxMHlNpERPqKLXJmAK7DlGHripM9FPFe1kt1k6NlNdgo00MNFjuUYx6cXO3s6GVIgbU+RW7VtymrgF0Wy+KN+ZdVRHQE2YqM+oWLm77aUN/Du63EiN1gs22SHxd0GfdZ/id6HhUxdHpGYHCt7uVIlFORqjYdu5sPZ5Cp7ml27comFVPQ0sj5F7lrCe9oeUodVP0orbiUeZ579RPjMzLbGWPso7/bqUa8zSW2DzCSHbwIh1P+ZmZlPrIsJumoZSLu7r+wGDm5ZPnpMzMgAmK2mRhkVVVVjQ8V8+Uhg00wl4H03X8c1f7j9f5MzMzMzMzMzMzMzMxxeveYE0I6Ly8IIcxlL27z+ZeRya0FrDhWknkjHWbmjldLfhMzMvm0YAkx00CnvvsK754YuZokiptN4Me1jAGI2wSFSbACH9Hra+7AA/v/PiQAZjSNc5Ln7gYd9tgecJvUlcf20zJ5iMupXOeEPX4fu5zOxLkgikQVLCbojdP+R+4Mxp5979O/gYYr/OCHEyMbmjpCHSggVkbVDLMk61aV074JtNpwuOJr+XDcP2kMAe2ZF35qCxcV5zSXXOF80hI9Zu6/ak7g/+CIjdLra9hLGIl2wmHxM2qekI30hMkCO0wGQYf9YHDtBNd1NyYpkiujdTvCheqMN2GtrJM/KGrXhzSVpMdSFffarhGTMRjUEIaf2Ly915VLz9CII2GEJZRonAefXWnaRUYJ6X2lHpULwiqmia4gNh6mZtEsQyLRmS7WCz8HXV3AiI5q+kRDJJwXaICpHIjalQhAHqsnRcFmDsRJEAWdHh1heQn/Y+ABdmT2LtDZWJDto0wpyURZH4AIorKZmsuU4Drpvzcc5XxY+Ew+1JldceV0YCOBpvkI9QFHpxFCl/iX/rEO6uP19V488xE87yq9GQINxxUABjxPGtDIh8RtnKUve9oUHLwjxehY6D6dbpoUbpPb55XsFhnhRaAQCVzVSdSEpiAElEyTVUQ3Qg0YsxEsf8SpPsVpcQuIk70IE2OctgOFz1WJb7ZYKNbiXUBjhQ02kGRgWISeyArmjca8h39HGPEro924MIS8/t4kB+cEdFgEiIJkhe4bxSDKOYjAyEpquya/Hql0wwuCjLdpeQI66h71VaGx6WxesLCC2MYR87NWtliFKUXgOn2bCqD3BKHf1wM6c1/wqKSjnJIKOcrjLLgLf1ihkxP7CLGgx1ZiAac6qQXm1WN3XxY7nGlCk5O026vAbXFvXLhQbdlFVzauztcqrGS3AGoebPgMkas9FhW2bp5pxW/Oa5++y65tb13ppHp5xwNSrFhR0meiidUkiWCjI6QUvmEmcGV7awwAIYPAU/KYOp0XfASIYh3NNBceGjMHJL2S0lTs5QpQ9HGqLDLL1CDp2Zq3jEoq5zhGTbN7bv//MZmE0ZkFSjpvvKYBl85chofNPzlIT7FdnAWzNinvGyBW6fAYuOTlXhXS54GOIAAJXmT/t2H/fxwaWR5HnPOSwDMlTrQmlC9hu8Ev9bP/i/5u2NJM09Xh/mv+WoR28hHmW4hN3TKtOSiFnlCd/0ICKARC0/fGcwAwbrk4tXX3XPCnSb0ra7/5uM+Wn8jCv/RM71H/4tcJ8DJUWLib0xucZyL73Ne/8DiI28+55PyIwp7H+SmslvBvhmvWl//w8MpbBtanDdhhS/39g0C8qd1LdN+SV3Kqe18cqyUCF+tvtXHuwMZdopx0zmG1l2vXsD+Bd//6FrK/lXZe6N/+NTVRdC9c2Bt+OP2U+JQVTCLtSlfMo3PRHzGoP14TXiD1r6HpFWbYrH4MbtJrJtOJsbOg/WJdKCo7lfkQR6l6Y0+I4I73c24/PydFgZHB3ZMlf9P1IkrfppSrTCpypii+lJhxOmQ1n5d+fXuYnil5n0C6+JRjQqhtaZOH4rfLFmb+99Ij9DqGL99w/hIHheKCH6QiMr77TWeeksFCjpsEUmAjvHzHdas0pJf1tqWdT4/ZWmx/siF5ZvePPEiBn76gi3ho3wg9m+FN7XZ+EXr/+txBsaLm6v4++zCDJCYzbd/rrTf1LL8/8e6/+fqALDey2SBzfVkszohBLL3i/1l4j9MPIObl176Rh4HY73bJBY2dkR35Ta08uiG+kAQDYi36jnVWrg8CKcNH90YAj9V+aMrfwUj1oZay78f8mJXpP/1B0C4eRlD2z1zi/tgqZ77m6YGdG2CTv3xYtJqoym+2yPP64t1xtLbkkdhNIVRSesUcHun07DuZ5JcYMCcaYl3a0FhXbvb5UqzBXxvxumLPm7KnIRoYq47nSfwI4t/wcb2Uwy7bqJ9i3B3X5r7TCjQv2TWTljfzidL+OO06Z2UdGxB7o9lkq/VIkblZO5/RbPBsPsLXV29qJyQgx8D7UHUwBgCK6fZQJWxE+j7adkG29yb7aNyHjyyh/sZD2DSuHA7G6bNLWHQ65Ght6zcMjZYin+207B900aX+QXnZP3Qt/6eV66jueKLr6ZGpf72XpneaeDeR12Dzg6BqnerAYwHa36FOqq4ccKvFi2scw6eFKDMwvKGZLxru/1NYgtZMbkygeWBDYedmJAg7T8w6WBxiF+MYmM0VFsTA5nrlidi3fPSTbcq4oCsbXkSSbAiJ07LneMCvF++Arb23T+jo/c8CNKHEJbb8V0jGeqzcmMQ1jKO/0KshIdDLtB38OfuJWAhwuWPCWy4LtPrJH0a3XU22ugyELjcDSJf/ydCsM2fLzeiXwPFZSJt+PMRkJF+kQgOrSCr/2d2dQ+D6VKGm6TQKVx8r0Ipk39f9l+UEiyapG4kf9pYESnJ5Q+xNCP/8Cze/5iuEkHJQXaXUUYuSRTdxLUj/7lCfADlBPg8s/rEaGMMR5A0CFgAAA"
    },
    address:{
        type:Object,
        default:{line1:"",line2:""}
    },
    gender:{
        type:String,
        default:"Not selected"
    },
    dob:{
        type:String,
        default:"Not selected"
    },
    phone:{
         type:String,
        default:"0000000000"
    }

},)

const userModel = mongoose.models.user||mongoose.model("user",userSchema);
export default userModel