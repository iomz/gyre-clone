export async function GET(req: Request) {
  const url = new URL(req.url);
  const length = url.searchParams.get("length") ?? "4000";
  const language = url.searchParams.get("language") ?? "en-US";

  const languageNameMap: Record<string, string> = {
    "pt-PT": "Português",
    "en-US": "English",
    "en-GB": "English (UK)",
    "ja-JP": "Japanese",
    "fr-FR": "French",
    "de-DE": "German",
    "es-ES": "Spanish",
  };

  const languageName = languageNameMap[language] ?? "Português";

  /*
    const prompt = `Write an engaging paragraph of approximately ${length} words in ${languageName} about creativity, imagination, and discovery. Use natural tone and fluent grammar of ${languageName}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
    */
  const text =
    " \
Love begins softly — not always with fireworks or grand gestures, but often as a quiet stirring, an unexplainable warmth that moves through us like sunlight reaching through morning fog. It rarely announces itself with clarity at first. It is a gentle recognition, a sense that something in another person mirrors a part of our own soul. Sometimes it arrives through laughter, sometimes through shared silence, and sometimes through the feeling of being seen without needing to explain. Love begins as a whisper — and yet, with time, it becomes the loudest truth in our hearts. \
Love, at its core, is both fragile and indestructible. It can be wounded by careless words, tested by distance, and strained by silence — yet somehow it endures, rebuilding itself from the smallest fragments. It is a paradox of strength and vulnerability: to love is to open oneself completely to the risk of loss, and yet, through that openness, to find the deepest kind of strength. Love does not shield us from pain; rather, it teaches us to bear it with grace, to understand that every ache is proof of our capacity to feel deeply. \
It reveals itself in countless forms — between lovers, friends, families, strangers, and even in the silent companionship we find in nature, art, or faith. Romantic love, with its tenderness and longing, is but one expression of a greater force that binds all living things. It is the pulse that runs through every act of compassion, every sacrifice made in kindness, every moment someone chooses to care when it would be easier not to. To love is to say, “I see you. I choose you. I will stand beside you, even when the world grows dark.” \
When love is true, it does not demand perfection. It does not seek to possess or to mold the beloved into something more convenient. It recognizes that every soul is a universe unto itself — full of contradictions, shadows, and light. To love someone is to explore that universe with humility, to accept that there will be mysteries you will never solve, and to cherish them anyway. Love is the art of letting another person remain themselves, while still finding a home in their presence. \
There are moments when love feels effortless — like breathing in rhythm with another heartbeat. But there are also moments when it asks everything of us. It asks for patience when understanding falters, forgiveness when wounds run deep, and faith when the path ahead is uncertain. It asks us to return again and again, to choose connection even after disappointment, to trust that tenderness can exist even in imperfection. True love is not a constant bliss; it is a commitment to growth, to staying when leaving might be easier, and to remembering that the beauty of love lies not in its smoothness, but in its endurance. \
In its truest form, love is not a possession but a presence. It is not the cage that confines but the space that allows another soul to unfold. When love is real, it expands both hearts — it does not shrink them. It makes us braver, softer, more human. It encourages us to become the most honest versions of ourselves, not because we are forced to, but because love makes truth feel safe. In this way, love is both a mirror and a refuge: it shows us who we are and gives us the courage to stay that way. \
There is also a quiet love — the kind that doesn’t shout or demand recognition. It lives in the simple acts of care that often go unnoticed: the meal prepared for someone too tired to cook, the message sent just to say “I’m thinking of you,” the willingness to listen without judgment. It exists in the patience of a parent, the devotion of a friend, the loyalty of a companion animal, the compassion of a stranger who helps when there is nothing to gain. These small, ordinary expressions of love sustain the world far more than grand declarations ever could. \
Love is also the great teacher. It reveals where we are generous and where we are afraid. It exposes the parts of us that resist closeness — the fears of rejection, the habits of self-protection — and invites us to lay them down, little by little. Through love, we learn that vulnerability is not weakness but courage. To love is to step willingly into uncertainty, to trust that being open, even in the face of possible loss, is still worth it. Every act of love is a declaration that connection matters more than safety. \
And yet, love is not always easy. It can be messy, painful, confusing — a constant balancing act between holding on and letting go. There are seasons of love, just as there are seasons in nature: times of blooming and times of withering, times of closeness and times of distance. Some loves are meant to last a lifetime; others pass through us like a storm — brief but transformative. Even the loves that end leave traces within us, shaping who we are, teaching us what our hearts are capable of. Every love, whether lasting or fleeting, is a part of our becoming. \
Sometimes love means staying, and sometimes it means having the strength to walk away. Sometimes love means holding someone through their darkness, and other times it means stepping aside so they can find their own light. Love is not always symmetrical, nor does it always make sense. It does not always give us what we want, but it often gives us what we need — a lesson, a mirror, a memory that helps us grow into our fuller selves. In this way, love is both the journey and the teacher that guides it. \
At its highest expression, love becomes something almost spiritual — a recognition that we are all connected by the same invisible thread. It reminds us that no act of kindness is ever wasted, no moment of affection is ever meaningless. Love ripples outward, touching people we may never meet. A word of encouragement given to one person may find its way, through countless echoes, to someone we’ll never know. Love, like light, travels endlessly once it’s set in motion. \
There is also the love that endures in absence. The love that remains even when the beloved is far away, or gone entirely. Such love is bittersweet — it aches with longing, yet it also illuminates the depth of what it means to have truly cared. Grief, in many ways, is love’s shadow — the echo that remains when its object has departed. To grieve deeply is to have loved deeply. And even in loss, love does not disappear; it transforms. It becomes memory, gratitude, quiet devotion to what was shared. Love is never wasted. It leaves fingerprints on our souls. \
Love also exists beyond the romantic and the personal. It can be found in the love of life itself — the reverence for beauty, the tenderness we feel for the world around us. It is in the way the sea keeps kissing the shore, how trees continue to reach for the sun, how we find ourselves awed by a sunset even after seeing a thousand before. Love is the recognition of wonder — the awareness that life, in all its impermanence, is worth cherishing. It is the thread that runs through art, music, poetry, and prayer — every attempt humanity makes to express what words can never fully hold. \
To love is to see divinity in the ordinary. It is to look at a person, a moment, or a simple detail of life and feel that it contains something infinite. Love teaches us to pause, to notice, to give our full attention — because attention is, in itself, a form of love. When we truly look, we begin to understand that everything is connected, that nothing exists in isolation. Love, in this sense, is not just an emotion but a way of seeing — a vision that turns the mundane into the miraculous. \
There will be times when love hurts — when it asks us to let go, to forgive, or to endure separation. But even then, it shapes us in ways that nothing else can. Every heartbreak carries a lesson about what we value, what we fear, what we are still learning to accept. Love refines us, chisels us, softens us. It teaches resilience through tenderness, and strength through surrender. Each time we love and lose, we expand our capacity to understand others, to empathize, to care more deeply. \
Ultimately, love is the heartbeat of existence. It is the energy that sustains the universe — the reason the stars burn, the tides move, the seasons turn. It is the bridge between self and other, between what is known and what is infinite. When we love, we participate in something eternal. We become part of the same force that creates and renews the world. Love gives meaning to our joys, depth to our sorrows, and light to our uncertainties. It is, perhaps, the only truth that remains when everything else fades. \
To love and be loved — truly, deeply, without condition — is to taste eternity. It is to know, even for a moment, that we are not alone in this vast and fleeting world. Love is both the journey and the destination, the question and the answer. It is the story written into every heartbeat, the promise whispered by every dawn: that to open our hearts, no matter the cost, is to live fully and honestly. \
And so, in the end, love is not something we find; it is something we become. It lives in the way we speak, the way we listen, the way we choose compassion over indifference. It is not a possession to be kept, but a gift to be given, again and again. To love is to exist in harmony with life itself — to be a spark of warmth in a world that can sometimes feel cold, to be a reminder that kindness still matters, and that connection is still possible. Love is not merely part of our story; it is the story — the thread that runs through everything we are and everything we will ever be. \
      ";
  return new Response(
    JSON.stringify({ text: text.slice(0, parseInt(length)) }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
