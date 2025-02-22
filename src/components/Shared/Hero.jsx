function Hero({ span, title, description }) {
    return (
        <section class="hero products-hero">
            <div class="container">
                <div class="hero-content text-center">
                    <span class="badge">{span}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>
        </section>
    )
}

export default Hero;